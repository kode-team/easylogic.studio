import {
  DOMDIFF,
  IF,
  KEYUP,
  LEFT_BUTTON,
  LOAD,
  POINTERMOVE,
  POINTEROUT,
  POINTERSTART,
  PREVENT,
  SUBSCRIBE,
} from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { END, MOVE } from "el/editor/types/event";
import "./GradientEditorView.scss";
import { BackgroundImage } from "el/editor/property-parser/BackgroundImage";
import { CSS_TO_STRING, STRING_TO_CSS } from "el/utils/func";
import {
  calculateAngle360,
  calculateAngleForVec3,
  calculateRotationOriginMat4,
  calculateScaleOriginMat4,
  vertiesMap,
} from "el/utils/math";
import { Length } from "el/editor/unit/Length";
import { GradientType, RadialGradientType } from "el/editor/types/model";
import { mat4, vec3 } from "gl-matrix";

var radialTypeList = [
  "circle",
  "circle farthest-corner",
  "circle closest-side",
  "circle closest-corner",
  "circle farthest-side",
  "ellipse",
  "ellipse farthest-corner",
  "ellipse closest-side",
  "ellipse closest-corner",
  "ellipse farthest-side",
];

var repeatTypeList = [
  "no-repeat",
  "repeat",
  "repeat-x",
  "repeat-y",
  "space",
  "round",
];

class GradientBaseEditor extends EditorElement {
  initializeData() {
    const value = this.$selection.current["background-image"];

    const cssValue = STRING_TO_CSS(value);

    this.state.backgroundImages = BackgroundImage.parseStyle(cssValue);
    this.state.backImages = BackgroundImage.parseStyle(cssValue);
    const current = this.$selection.current;
    this.state.gradient = this.state.backImages[this.state.index];
    this.state.contentBox = current.contentBox;
    this.state.backgroundImageMatrix = current.createBackgroundImageMatrix(
      this.state.index
    );
  }

  updateData() {
    var value = CSS_TO_STRING(
      BackgroundImage.toPropertyCSS(this.state.backgroundImages)
    );

    this.command(
      "setAttributeForMulti",
      "change background image",
      this.$selection.packByValue({
        "background-image": value,
      })
    );
  }
}

class GradientResizer extends GradientBaseEditor {
  [POINTERSTART("$el .resizer") +
    LEFT_BUTTON +
    MOVE("calculateMovedResizer") +
    END("calculateMovedEndResizer") +
    PREVENT](e) {
    this.state.$target = e.$dt;
    this.$el.toggleClass("dragging", true);
    this.initializeData();
    this.initMousePoint = this.$viewport.getWorldPosition(e);
    this.isShiftKey = e.shiftKey;
  }

  calculateMovedResizer(dx, dy) {
    const targetMousePoint = this.$viewport.getWorldPosition();

    // 1. 움직이는 vertex 를 구한다.
    const currentVertex = vec3.clone(this.initMousePoint);
    const nextVertex = targetMousePoint;

    // 3. invert matrix 를 실행해서  기본 좌표로 복귀한다.
    const reverseMatrix = this.$selection.current.absoluteMatrixInverse;
    const [currentResult, nextResult] = vertiesMap(
      [currentVertex, nextVertex],
      reverseMatrix
    );

    // 4. 복귀한 좌표에서 차이점을 구한다.
    const realDist = vec3.subtract([], nextResult, currentResult);
    const { backRect: rect } = this.state.backgroundImageMatrix;

    // width + dx, height + dy 를 적용한 recoverOffset 을 구한다.
    const backgroundImage = this.state.gradient;
    const backRect = backgroundImage.recoverOffset(
      rect.x,
      rect.y,
      this.state.contentBox,
      realDist[0],
      realDist[1],
      {
        shiftKey: this.$config.get('bodyEvent').shiftKey
      }
    );

    this.state.backgroundImages[this.state.index].reset({
      x: backRect.x,
      y: backRect.y,
      width: backRect.width,
      height: backRect.height,
    });

    this.updateData();
  }

  calculateMovedEndResizer() {
    this.updateData();
    this.$el.toggleClass("dragging", false);    
  }

  [POINTERSTART("$el .back-rect") +
    LEFT_BUTTON +
    MOVE("calculateMovedRect") +
    END("calculateMovedEndRect") +
    PREVENT](e) {
    this.state.$target = e.$dt;

    this.initializeData();
    this.initMousePoint = this.$viewport.getWorldPosition(e);
  }

  calculateMovedRect(dx, dy) {
    const targetMousePoint = this.$viewport.getWorldPosition();

    // 1. 움직이는 vertex 를 구한다.
    const currentVertex = vec3.clone(this.initMousePoint);
    const nextVertex = targetMousePoint;

    // 3. invert matrix 를 실행해서  기본 좌표로 복귀한다.
    // var currentResult = vec3.transformMat4([], currentVertex, reverseMatrix);62849
    // var nextResult = vec3.transformMat4([], nextVertex, reverseMatrix);
    const reverseMatrix = this.$selection.current.absoluteMatrixInverse;
    const [currentResult, nextResult] = vertiesMap(
      [currentVertex, nextVertex],
      reverseMatrix
    );

    // 4. 복귀한 좌표에서 차이점을 구한다.
    const realDist = vec3.subtract([], nextResult, currentResult);
    const { backRect: rect } = this.state.backgroundImageMatrix;

    const backgroundImage = this.state.gradient;

    const backRect = backgroundImage.recoverOffset(
      rect.x + realDist[0],
      rect.y + realDist[1],
      this.state.contentBox
    );

    this.state.backgroundImages[this.state.index].reset({
      x: backRect.x,
      y: backRect.y,
    });

    this.updateData();
  }

  calculateMovedEndRect(dx, dy) {
    // 반복 타입 바꾸기
    if (dx == 0 && dy === 0) {
      const index = repeatTypeList.indexOf(this.state.gradient.repeat);

      this.state.backgroundImages[this.state.index].repeat =
        repeatTypeList[(index + 1) % repeatTypeList.length];
    }

    this.updateData();
  }
}

class GradientRotateEditor extends GradientResizer {
  /**
   * 회전하기
   *
   * linear gradient, conic gradient
   *
   * shift + drag 하면 15도 기준으로 회전
   *
   * @param {PointerEvent} e
   */
  [POINTERSTART("$el .gradient-angle .rotate") +
    LEFT_BUTTON +
    MOVE("calculateMovedAngle") +
    END("calculatedMovedEndAngle") +
    PREVENT](e) {
    this.state.$target = e.$dt;
    this.initializeData();
    this.$el.toggleClass("dragging", true);

    this.state.centerX = +this.state.$target.data("center-x");
    this.state.centerY = +this.state.$target.data("center-y");
    this.state.startX = +this.state.$target.attr("cx");
    this.state.startY = +this.state.$target.attr("cy");

    this.state.$target.toggleClass("moved");
  }

  calculateMovedAngle(dx, dy) {
    const center = [this.state.centerX, this.state.centerY, 0];
    const point = [this.state.startX, this.state.startY, 0];
    const dist = [dx, dy, 0];

    const distAngle = calculateAngleForVec3(point, center, dist);

    let newAngle = Math.floor(this.state.gradient.image.angle + distAngle);

    if (this.$config.get("bodyEvent").shiftKey) {
      newAngle -= newAngle % this.$config.get("fixed.gradient.angle");
    }

    this.state.backgroundImages[this.state.index].image.angle = newAngle;

    this.updateData();
  }

  calculatedMovedEndAngle() {
    this.state.$target.toggleClass("moved");
    this.$el.toggleClass("dragging", false);
    this.updateData();
  }
}

class GradientColorstepEditor extends GradientRotateEditor {
  [KEYUP("$el .colorstep")](e) {
    const index = +e.$dt.data("index");
    switch (e.code) {
      case "Delete":
      case "Backspace":
        this.removeStep(index);
        break;
      case "BracketRight":
        this.sortToRight(index);
        break;
      case "BracketLeft":
        this.sortToLeft(index);
        break;
      case "Equal":
        this.appendColorStep(index);
        break;
      case "Minus":
        this.prependColorStep(index);
        break;
    }
  }

  removeStep(currentIndex) {
    const image = this.state.lastBackgroundMatrix.backgroundImage.image;
    image.removeColorStepByIndex(currentIndex);

    this.updateColorStepStatus(image, -1);
  }

  sortToRight() {
    const image = this.state.lastBackgroundMatrix.backgroundImage.image;
    image.sortToRight();

    this.updateColorStepStatus(image, -1);
  }

  sortToLeft() {
    const image = this.state.lastBackgroundMatrix.backgroundImage.image;
    image.sortToLeft();

    this.updateColorStepStatus(image, -1);
  }

  appendColorStep(currentIndex) {
    const nextIndex = currentIndex + 1;
    const image = this.state.lastBackgroundMatrix.backgroundImage.image;

    const currentColorStep = image.colorsteps[currentIndex];
    const nextColorStep = image.colorsteps[nextIndex];
    let newIndex = -1;

    if (!nextColorStep) {
      if (currentColorStep.percent !== 100) {
        newIndex = image.insertColorStep(
          currentColorStep.percent + (100 - currentColorStep.percent) / 2
        );
      }
    } else {
      newIndex = image.insertColorStep(
        currentColorStep.percent +
          (nextColorStep.percent - currentColorStep.percent) / 2
      );
    }

    this.updateColorStepStatus(image, newIndex);
  }

  prependColorStep(currentIndex) {
    const prevIndex = currentIndex - 1;
    const image = this.state.lastBackgroundMatrix.backgroundImage.image;
    const currentColorStep = image.colorsteps[currentIndex];
    const prevColorStep = image.colorsteps[prevIndex];
    let newIndex = -1;
    if (!prevColorStep) {
      if (currentColorStep.percent !== 0) {
        newIndex = image.insertColorStep(currentColorStep.percent);
      }
    } else {
      newIndex = image.insertColorStep(
        prevColorStep.percent +
          (currentColorStep.percent - prevColorStep.percent) / 2
      );
    }

    this.updateColorStepStatus(image, newIndex);
  }

  [POINTERSTART("$el .colorstep") +
    MOVE("moveColorStep") +
    END("moveEndColorStep")](e) {
    this.$el.toggleClass("dragging", true);
    this.state.hoverColorStep = null;
    this.initializeData();

    const $colorstep = e.$dt;
    this.$targetIndex = +$colorstep.data("index");

    if (e.altKey) {
      this.removeStep(this.$targetIndex);
      this.state.altKey = true;
      return;
    }

    const result = this.state.backgroundImageMatrix;

    switch (result.backgroundImage.image.type) {
      case GradientType.LINEAR:
      case GradientType.REPEATING_LINEAR:
        this.centerPosition = this.$viewport.applyVertex(result.centerPosition);
        this.startPoint = this.$viewport.applyVertex(result.startPoint);
        this.endPoint = this.$viewport.applyVertex(result.endPoint);
        this.screenXY = this.$viewport.applyVertex(
          result.colorsteps[this.$targetIndex].pos
        );

        this.rotateInverse = calculateRotationOriginMat4(
          -this.state.gradient.image.angle,
          this.centerPosition
        );
        break;
      case GradientType.RADIAL:
      case GradientType.REPEATING_RADIAL:
        this.centerPosition = this.$viewport.applyVertex(
          result.radialCenterPosition
        );
        this.startPoint = this.$viewport.applyVertex(result.radialStartPoint);
        this.endPoint = this.$viewport.applyVertex(result.radialEndPoint);
        this.screenXY = this.$viewport.applyVertex(
          result.colorsteps[this.$targetIndex].pos
        );

        const dist = vec3.subtract([], this.endPoint, this.startPoint);

        // 눞혀진 각은 180 도 이다. 그렇다는 이야기는 회전을 하지 않았다는 의미가 되고 -180 을 해서 다시 0도로 맞춰준다.
        const angle = calculateAngle360(dist[0], dist[1]) - 180;

        this.rotateInverse = calculateRotationOriginMat4(
          -angle,
          this.centerPosition
        );
        break;
      case GradientType.CONIC:
      case GradientType.REPEATING_CONIC:
        this.centerPosition = this.$viewport.applyVertex(
          result.radialCenterPosition
        );
        this.startPoint = this.$viewport.applyVertex(
          result.radialShapePoint
        );
        this.newStartPoint = vec3.subtract(
          [],
          this.startPoint,
          this.centerPosition
        );
        this.newStartAngle = calculateAngle360(this.newStartPoint[0], this.newStartPoint[1]);

        // conic 의 경우 중간 지점에 따라 UI 크기가 달라지기 때문에 
        // 마지막 UI 에서 x, y 를 가지고 오도록 한다. 
        const x = +$colorstep.data('x');
        const y = +$colorstep.data('y');
        this.screenXY = [x, y, 0];        

        this.endPoint = this.$viewport.applyVertex(result.radialEndPoint);
        this.rotateInverse = mat4.create();        
        break;
    }
  }

  moveColorStep(dx, dy) {
    if (this.state.altKey) return;

    const nextPoint = vec3.add([], this.screenXY, [dx, dy, 0]);

    // 회전량을 거꾸로 계산해서 일직선상으로 돌린다.
    const [baseStartPoint, baseEndPoint, baseNextPoint] = vertiesMap(
      [this.startPoint, this.endPoint, nextPoint],
      this.rotateInverse
    );

    const result = this.state.backgroundImageMatrix;
    let newDist = 0;
    let baseDist = 0;

    switch (result.backgroundImage.image.type) {
      case GradientType.LINEAR:
      case GradientType.REPEATING_LINEAR:
        var [s, e, n] = [baseStartPoint[1], baseEndPoint[1], baseNextPoint[1]];
        var baseDefaultDist = Math.abs(s - e);
        if (s < n) {
          // startPoint 보다 아래에 있는 경우
          newDist = ((-1 * Math.abs(n - s)) / baseDefaultDist) * 100;
        } else if (e > n) {
          newDist = (Math.abs(n - s) / baseDefaultDist) * 100;
        } else {
          var distStart = Math.abs(s - n);
          var distEnd = Math.abs(e - n);

          newDist = (distStart / (distEnd + distStart)) * 100;
        }
        baseDist = vec3.dist(this.startPoint, this.endPoint);
        break;
      case GradientType.RADIAL:
      case GradientType.REPEATING_RADIAL:
        var [s, e, n] = [baseStartPoint[0], baseEndPoint[0], baseNextPoint[0]];
        var baseDefaultDist = Math.abs(s - e);
        if (n < s) {
          // startPoint 보다 왼쪽에 있는 경우
          newDist = ((-1 * Math.abs(n - s)) / baseDefaultDist) * 100;
        } else if (n > e) {
          newDist = (Math.abs(n - s) / baseDefaultDist) * 100;
        } else {
          newDist = ((n - s) / baseDefaultDist) * 100;
        }
        baseDist = vec3.dist(this.startPoint, this.endPoint);
        break;
      case GradientType.CONIC:
      case GradientType.REPEATING_CONIC:
        const newNextPoint = vec3.subtract(
          [],
          nextPoint,
          this.centerPosition
        );
        let nextAngle = calculateAngle360(newNextPoint[0], newNextPoint[1]);

        if (this.$config.get("bodyEvent").shiftKey) {
          nextAngle -= nextAngle % this.$config.get("fixed.gradient.angle");
        }


        let newAngle = nextAngle - this.newStartAngle


        newDist = (newAngle / 360) * 100;
        newDist = (newDist + 100) % 100;

        baseDist = 100;
        break;

    }

    const image = this.state.gradient.image;
    image.colorsteps[this.$targetIndex].setValue(newDist, baseDist);

    const targetColorStep = {
      color: image.colorsteps[this.$targetIndex].color,
      percent: image.colorsteps[this.$targetIndex].percent,
    };

    const nextImage = this.state.backgroundImages[this.state.index].image;

    nextImage.colorsteps = image.colorsteps.map((it) => {
      return it;
    });
    nextImage.sortColorStep();

    this.emit("updateGradientEditor", nextImage, targetColorStep);

    var value = CSS_TO_STRING(
      BackgroundImage.toPropertyCSS(this.state.backgroundImages)
    );

    this.command(
      "setAttributeForMulti",
      "change background image",
      this.$selection.packByValue({
        "background-image": value,
      })
    );
  }

  moveEndColorStep(dx, dy) {
    if (this.state.altKey) {
      this.state.altKey = false;
      return;
    }

    if (dx === 0 && dy === 0) {
      const image = this.state.backgroundImages[this.state.index].image;
      image.colorsteps[this.$targetIndex].toggle();

      const targetColorStep = {
        color: image.colorsteps[this.$targetIndex].color,
        percent: image.colorsteps[this.$targetIndex].percent,
      };

      this.emit("updateGradientEditor", image, targetColorStep);

      var value = CSS_TO_STRING(
        BackgroundImage.toPropertyCSS(this.state.backgroundImages)
      );

      this.command(
        "setAttributeForMulti",
        "change background image",
        this.$selection.packByValue({
          "background-image": value,
        })
      );
    }

    this.$el.toggleClass("dragging", false);
  }

  updateColorStepStatus(image, index) {
    this.initializeData();

    const { color, percent } = image.colorsteps[index] || {};
    this.emit("updateGradientEditor", image, { color, percent });

    this.state.backgroundImages[this.state.index].image = image;

    var value = CSS_TO_STRING(
      BackgroundImage.toPropertyCSS(this.state.backgroundImages)
    );

    this.command(
      "setAttributeForMulti",
      "change background image",
      this.$selection.packByValue({
        "background-image": value,
      })
    );
    this.state.hoverColorStep = null;
  }

  [POINTERSTART("$el .area-line")]() {
    const image = this.state.lastBackgroundMatrix.backgroundImage.image;

    const index = image.insertColorStep(this.state.hoverColorStep.percent);

    this.updateColorStepStatus(image, index);
  }

  [POINTEROUT("$el .area-line")](evt) {
    if (this.state.hoverColorStep) {
      this.state.hoverColorStep = null;

      this.refresh();
    }
  }

  [POINTERMOVE("$el .area-line")](evt) {
    const nextPoint = this.$viewport.applyVertex(
      this.$viewport.getWorldPosition(evt)
    );

    const image = this.state.lastBackgroundMatrix.backgroundImage.image;

    let baseStartPoint, baseEndPoint, baseNextPoint;

    switch (image.type) {
      case GradientType.LINEAR:
      case GradientType.REPEATING_LINEAR:
        [baseStartPoint, baseEndPoint, baseNextPoint] = vertiesMap(
          [this.state.startPoint, this.state.endPoint, nextPoint],
          this.state.rotateInverse
        );

        var newDist = 0;
        var [s, e, n] = [baseStartPoint[1], baseEndPoint[1], baseNextPoint[1]];
        var baseDefaultDist = Math.abs(s - e);
        if (s < n) {
          // startPoint 보다 아래에 있는 경우
          newDist = ((-1 * Math.abs(n - s)) / baseDefaultDist) * 100;
        } else if (e > n) {
          newDist = (Math.abs(n - s) / baseDefaultDist) * 100;
        } else {
          const distStart = Math.abs(s - n);
          const distEnd = Math.abs(e - n);

          newDist = (distStart / (distEnd + distStart)) * 100;
        }

        this.state.hoverColorStep =
          this.state.lastBackgroundMatrix.backgroundImage.image.pickColorStep(
            newDist
          );
        break;
      case GradientType.RADIAL:
      case GradientType.REPEATING_RADIAL:
        [baseStartPoint, baseEndPoint, baseNextPoint] = [
          this.state.startPoint,
          this.state.endPoint,
          nextPoint,
        ];

        var newDist = 0;
        var [s, e, n] = [baseStartPoint[0], baseEndPoint[0], baseNextPoint[0]];
        var baseDefaultDist = Math.abs(s - e);
        if (n < s) {
          // startPoint 보다 아래에 있는 경우
          newDist = ((-1 * Math.abs(n - s)) / baseDefaultDist) * 100;
        } else {
          newDist = (Math.abs(n - s) / baseDefaultDist) * 100;
        }

        this.state.hoverColorStep =
          this.state.lastBackgroundMatrix.backgroundImage.image.pickColorStep(
            newDist
          );
        break;
      case GradientType.CONIC:
      case GradientType.REPEATING_CONIC:
        // centerPosition 기준으로 startPoint 와 nextPoint 의 angle 을 구한다.

        // 먼저 angle 을 돌려준다.
        // centerPoisition 기준으로 다시 angle 을 구한다.
        const newStartPoint = vec3.subtract(
          [],
          this.state.startPoint,
          this.state.centerPosition
        );

        const newNextPoint = vec3.subtract(
          [],
          nextPoint,
          this.state.centerPosition
        );

        const startAngle = calculateAngle360(
          newStartPoint[0],
          newStartPoint[1]
        );
        const nextAngle = calculateAngle360(newNextPoint[0], newNextPoint[1]);

        var newDist = ((nextAngle - startAngle) / 360) * 100;
        this.state.hoverColorStep =
          this.state.lastBackgroundMatrix.backgroundImage.image.pickColorStep(
            newDist
          );

        break;
    }

    this.refresh();
  }
}

/**
 * Gradient Editor View
 *
 * 모든 좌표 계산은 matrix 를 기준으로 한다.
 *
 * current.createBackgroundImageMatrix(index) 를 통해서 matrix 를 생성한 값을 캐쉬로 잡고 처리한다.
 *
 */

export default class GradientEditorView extends GradientColorstepEditor {
  template() {
    return <div class="elf--gradient-editor-view"></div>;
  }

  isMovableCenter(e) {
    this.initializeData();

    return [
      GradientType.RADIAL,
      GradientType.REPEATING_RADIAL,
      GradientType.CONIC,
      GradientType.REPEATING_CONIC,
    ].includes(this.state.gradient.type);
  }

  /**
   * 드래그 해서 객체 옮기기
   *
   * ctrl + pointerstart 하는  시점에 카피해보자.
   *
   * @param {PointerEvent} e
   */
  [POINTERSTART("$el .gradient-position") +
    LEFT_BUTTON +
    MOVE("calculateMovedElement") +
    END("calculateMovedEndElement") +
    IF("isMovableCenter") +
    PREVENT](e) {
    this.state.$target = e.$dt;
    this.state.left = Length.parse(e.$dt.css("left")).value;
    this.state.top = Length.parse(e.$dt.css("top")).value;
    this.$el.toggleClass("dragging", true);
    this.initializeData();
  }

  calculateMovedElement(dx, dy) {
    const newLeft = this.state.left + dx;
    const newTop = this.state.top + dy;

    this.state.$target.css({
      left: Length.px(newLeft),
      top: Length.px(newTop),
    });

    // 위치 바꾸기
    // screen 좌표를 worldPosition 으로 바꾸기
    const worldPosition = this.$viewport.applyVertexInverse([
      newLeft,
      newTop,
      0,
    ]);

    // local position 으로 바꾸기
    const localPosition = vertiesMap(
      [worldPosition],
      this.$selection.current.absoluteMatrixInverse
    )[0];

    const backgroundImage = this.state.gradient;

    const backRect = backgroundImage.getOffset(this.state.contentBox);

    const newX = localPosition[0] - backRect.x;
    const newY = localPosition[1] - backRect.y;

    this.state.backgroundImages[this.state.index].image.radialPosition = [
      Length.percent((newX / backRect.width) * 100),
      Length.percent((newY / backRect.height) * 100),
    ];

    this.updateData();
  }

  calculateMovedEndElement(dx, dy) {
    if (dx == 0 && dy === 0) {
      switch (this.state.gradient.type) {
        case GradientType.RADIAL:
        case GradientType.REPEATING_RADIAL:
          const findKey =
            `${this.state.gradient.image.radialType} ${this.state.gradient.image.radialSize}`.trim();
          const index = radialTypeList.indexOf(findKey);

          const [radialType, radialSize] =
            radialTypeList[(index + 1) % radialTypeList.length].split(" ");

          const image = this.state.backgroundImages[this.state.index].image;

          image.radialType = radialType;
          image.radialSize = radialSize;
          break;
      }
    }

    this.updateData();
    this.$el.toggleClass("dragging", false);
  }

  refresh() {
    if (this.state.isShow) {
      this.load();
    }
  }

  [SUBSCRIBE("updateViewport")]() {
    this.refresh();
  }

  [SUBSCRIBE("refreshSelectionStyleView")]() {
    if (this.$selection.current) {
      if (
        this.$selection.hasChangedField(
          "x",
          "y",
          "width",
          "height",
          "angle",
          "background-image",
          "border",
          "padding"
        )
      ) {
        this.refresh();
      }
    }
  }

  [SUBSCRIBE("showGradientEditorView")]({ index }) {
    this.state.index = index;

    this.$el.show();
    this.state.isShow = true;

    this.refresh();
    this.emit("recoverCursor");

    this.emit("push.mode.view", "GradientEditorView");
  }

  [SUBSCRIBE("hideGradientEditorView")]() {
    this.$el.hide();
    this.state.isShow = false;

    this.emit("pop.mode.view", "GradientEditorView");
  }

  [SUBSCRIBE("refreshSelection")]() {
    this.refresh();
  }

  makeGradientRect(result) {
    const boxPosition = this.$viewport.applyVerties(result.backVerties);

    return (
      <>
        <div class="gradient-rect">
          <svg>
            <path
              class="back-rect"
              d={`
                    M ${boxPosition[0][0]} ${boxPosition[0][1]}
                    L ${boxPosition[1][0]} ${boxPosition[1][1]}
                    L ${boxPosition[2][0]} ${boxPosition[2][1]}
                    L ${boxPosition[3][0]} ${boxPosition[3][1]}
                    Z
                `}
            />
          </svg>
        </div>
        <div
          class="resizer"
          data-direction="bottom-right"
          style={{
            left: Length.px(boxPosition[2][0]),
            top: Length.px(boxPosition[2][1]),
          }}
        ></div>
      </>
    );
  }

  makeCenterPoint(result) {
    const { image } = result.backgroundImage;

    switch (image.type) {
      case GradientType.LINEAR:
      case GradientType.REPEATING_LINEAR:
        return this.makeLinearCenterPoint(result);
      case GradientType.RADIAL:
      case GradientType.REPEATING_RADIAL:
        return this.makeRadialCenterPoint(result);
      case GradientType.CONIC:
      case GradientType.REPEATING_CONIC:
        return this.makeConicCenterPoint(result);
    }

    return "";
  }

  makeConicCenterPoint(result) {
    const { image } = result.backgroundImage;

    let boxPosition, centerPosition, centerStick, startPoint, endPoint;
    let radialStartPoint, radialEndPoint, radialShapePoint, colorsteps;

    boxPosition = this.$viewport.applyVerties(result.backVerties);

    // radial, conic
    centerPosition = this.$viewport.applyVertex(result.radialCenterPosition);

    radialStartPoint = this.$viewport.applyVertex(result.radialStartPoint);
    radialEndPoint = this.$viewport.applyVertex(result.radialEndPoint);
    radialShapePoint = this.$viewport.applyVertex(result.radialShapePoint);

    let lastDist = vec3.dist(radialStartPoint, radialEndPoint) / 2;

    if (lastDist < 50) {
      lastDist = 50;
    }

    colorsteps = result.colorsteps.map((it) => {
      it.screenXY = this.$viewport.applyVertex(it.pos);
      const pointDist = vec3.dist(it.screenXY, radialStartPoint);
      if (pointDist < lastDist) {
        it.screenXY = vec3.lerp(
          [],
          radialStartPoint,
          vec3.lerp([], radialStartPoint, it.screenXY, 1 / pointDist),
          lastDist
        );
      } else if (pointDist > lastDist) {
        it.screenXY = vec3.lerp(
          [],
          radialStartPoint,
          it.screenXY,
          lastDist / pointDist
        );
      }

      const dist = vec3.subtract([], it.screenXY, radialStartPoint);
      it.angle = calculateAngle360(dist[0], dist[1]);

      return it;
    });

    // radial, conic
    centerPosition = this.$viewport.applyVertex(result.radialCenterPosition);
    const stickPoint = this.$viewport.applyVertex(result.radialShapePoint);

    centerStick = vec3.lerp(
      [],
      centerPosition,
      vec3.lerp(
        [],
        centerPosition,
        stickPoint,
        1 / vec3.dist(centerPosition, stickPoint)
      ),
      lastDist + 20
    );

    // const targetStick = vec3.lerp([], newCenterStick, centerPosition, 20/(lastDist + 20)); // 경계선에서 위치만 지정할 때
    const targetStick = vec3.lerp([], centerStick, centerPosition, 1);

    let newHoverColorStepPoint = null;
    if (this.state.hoverColorStep) {
      // hover 대상의 angle 을 구하고
      const hoverAngle = this.state.hoverColorStep.percent * 3.6;

      // center 로 부터 shape point 의 길이를 구한다음
      const originDist = vec3.dist(centerPosition, radialShapePoint);

      // 해당 길이에 해당하는 좌표를 다시 구하고 angle 을 곱해준다.
      [newHoverColorStepPoint] = vertiesMap(
        [
          vec3.lerp(
            [],
            centerPosition,
            radialShapePoint,
            (lastDist + 15) / originDist
          ),
        ],
        calculateRotationOriginMat4(hoverAngle, centerPosition)
      );
    }


    return (
      <>
        <div
          class="gradient-position center"
          data-radial-type={image.radialType}
          style={{
            left: Length.px(centerPosition[0]),
            top: Length.px(centerPosition[1]),
          }}
        ></div>

        <svg class="gradient-angle">
          <circle
            class="size"
            cx={radialStartPoint[0]}
            cy={radialStartPoint[1]}
            r={lastDist}
          />
          <circle
            class="area-line"
            cx={radialStartPoint[0]}
            cy={radialStartPoint[1]}
            r={lastDist}
          />
          <path
            class="stick"
            d={`
                M ${targetStick[0]} ${targetStick[1]}
                L ${centerStick[0]} ${centerStick[1]}
            `}
          />
          <circle
            class="rotate"
            cx={centerStick[0]}
            cy={centerStick[1]}
            r="7"
            data-center-x={centerPosition[0]}
            data-center-y={centerPosition[1]}
          />
          {/* {colorsteps.map((it) => {
            return (
              <path
                class="color-stick"
                d={`
                  M ${radialStartPoint[0]} ${radialStartPoint[1]}
                  L ${it.screenXY[0]} ${it.screenXY[1]}
              `}
                stroke={it.color}
                fill="transparent"
                stroke-width="1"
              />
            );
          })} */}
          {colorsteps.map((it, index) => {
            if (it.cut) {
              return (
                <rect
                  id={it.id}
                  data-index={index}
                  class="colorstep"
                  x={it.screenXY[0] - 7}
                  y={it.screenXY[1] - 7}
                  transform={`rotate(${it.angle} ${it.screenXY[0]} ${it.screenXY[1]})`}
                  width={14}
                  height={14}
                  fill={it.color}
                  tabIndex={-1}
                  data-x={it.screenXY[0]}
                  data-y={it.screenXY[1]}
                ></rect>
              );
            } else {
              return (
                <rect
                  id={it.id}
                  data-index={index}
                  class="colorstep"
                  x={it.screenXY[0] - 7}
                  y={it.screenXY[1] - 7}
                  transform={`rotate(${it.angle} ${it.screenXY[0]} ${it.screenXY[1]})`}
                  rx={7}
                  ry={7}
                  width={14}
                  height={14}
                  fill={it.color}
                  tabIndex={-1}
                  data-x={it.screenXY[0]}
                  data-y={it.screenXY[1]}                  
                ></rect>
              );
            }
          })}
          {newHoverColorStepPoint && (
            <circle
              class="hover-colorstep"
              r="5"
              cx={newHoverColorStepPoint[0]}
              cy={newHoverColorStepPoint[1]}
              fill={this.state.hoverColorStep.color}
            ></circle>
          )}
        </svg>
      </>
    );
  }

  makeRadialCenterPoint(result) {
    const { image } = result.backgroundImage;

    let boxPosition,
      centerPosition,
      colorsteps,
      radialStartPoint,
      radialEndPoint,
      radialShapePoint,
      radialEndPoint1,
      radialShapePoint1,
      radialEndPoint2,
      radialShapePoint2;

    boxPosition = this.$viewport.applyVerties(result.backVerties);

    // radial, conic
    centerPosition = this.$viewport.applyVertex(result.radialCenterPosition);

    radialStartPoint = this.$viewport.applyVertex(result.radialStartPoint);
    radialEndPoint = this.$viewport.applyVertex(result.radialEndPoint);
    radialShapePoint = this.$viewport.applyVertex(result.radialShapePoint);
    radialEndPoint1 = this.$viewport.applyVertex(result.radialEndPoint1);
    radialEndPoint2 = this.$viewport.applyVertex(result.radialEndPoint2);
    radialShapePoint1 = this.$viewport.applyVertex(result.radialShapePoint1);
    radialShapePoint2 = this.$viewport.applyVertex(result.radialShapePoint2);

    [radialEndPoint1, radialEndPoint2] = vertiesMap(
      [radialEndPoint1, radialEndPoint2],
      calculateScaleOriginMat4(30, radialEndPoint)
    );

    [radialShapePoint1, radialShapePoint2] = vertiesMap(
      [radialShapePoint1, radialShapePoint2],
      calculateScaleOriginMat4(30, radialShapePoint)
    );

    colorsteps = result.colorsteps.map((it) => {
      it.screenXY = this.$viewport.applyVertex(it.pos);
      return it;
    });
    if (image.radialType === RadialGradientType.ELLIPSE) {
      radialShapePoint = this.$viewport.applyVertex(result.radialShapePoint);
    }

    // angle 새로 구하기
    const dist = vec3.subtract([], radialEndPoint, radialStartPoint);
    const angle = calculateAngle360(dist[0], dist[1]);

    let newHoverColorStepPoint = null;
    if (this.state.hoverColorStep) {
      newHoverColorStepPoint = vec3.lerp(
        [],
        radialStartPoint,
        radialEndPoint,
        this.state.hoverColorStep.percent / 100
      );
    }

    return (
      <>
        <div
          class="gradient-position center"
          data-radial-type={image.radialType}
          style={{
            left: Length.px(centerPosition[0]),
            top: Length.px(centerPosition[1]),
          }}
        ></div>

        <svg class="gradient-radial-line">
          <path
            d={`
              M ${radialStartPoint[0]} ${radialStartPoint[1]}
              L ${radialEndPoint[0]} ${radialEndPoint[1]}
          `}
            class="area-line"
          />
          <path
            d={`
              M ${radialStartPoint[0]} ${radialStartPoint[1]}
              L ${radialEndPoint[0]} ${radialEndPoint[1]}
          `}
            class="start-end-line"
          />
          <path
            d={`
              M ${radialEndPoint1[0]} ${radialEndPoint1[1]}
              L ${radialEndPoint2[0]} ${radialEndPoint2[1]}
          `}
            class="start-end-line"
          />
          <path
            d={`
              M ${radialShapePoint1[0]} ${radialShapePoint1[1]}
              L ${radialShapePoint2[0]} ${radialShapePoint2[1]}
          `}
            class="start-end-line"
          />
          {image.radialType === RadialGradientType.CIRCLE ? (
            <circle
              class="size"
              cx={radialStartPoint[0]}
              cy={radialStartPoint[1]}
              r={vec3.dist(radialStartPoint, radialEndPoint)}
            />
          ) : null}
          {image.radialType === RadialGradientType.ELLIPSE ? (
            <ellipse
              class="size"
              cx={radialStartPoint[0]}
              cy={radialStartPoint[1]}
              transform={`rotate(${angle} ${radialStartPoint[0]} ${radialStartPoint[1]})`}
              rx={vec3.dist(radialStartPoint, radialEndPoint)}
              ry={vec3.dist(radialStartPoint, radialShapePoint)}
            />
          ) : null}
          {colorsteps.map((it, index) => {
            if (it.cut) {
              return (
                <rect
                  id={it.id}
                  data-index={index}
                  class="colorstep"
                  x={it.screenXY[0] - 7}
                  y={it.screenXY[1] - 7}
                  transform={`rotate(${angle} ${it.screenXY[0]} ${it.screenXY[1]})`}
                  width={14}
                  height={14}
                  fill={it.color}
                  tabIndex={-1}
                ></rect>
              );
            } else {
              return (
                <rect
                  id={it.id}
                  data-index={index}
                  class="colorstep"
                  x={it.screenXY[0] - 7}
                  y={it.screenXY[1] - 7}
                  transform={`rotate(${angle} ${it.screenXY[0]} ${it.screenXY[1]})`}
                  rx={7}
                  ry={7}
                  width={14}
                  height={14}
                  fill={it.color}
                  tabIndex={-1}
                ></rect>
              );
            }
          })}
          {newHoverColorStepPoint && (
            <circle
              class="hover-colorstep"
              r="7"
              cx={newHoverColorStepPoint[0]}
              cy={newHoverColorStepPoint[1]}
              fill={this.state.hoverColorStep.color}
            ></circle>
          )}
        </svg>
      </>
    );
  }

  makeLinearCenterPoint(result) {
    const { image } = result.backgroundImage;

    let boxPosition,
      centerPosition,
      centerStick,
      startPoint,
      endPoint,
      areaStartPoint,
      areaEndPoint,
      colorsteps;

    boxPosition = this.$viewport.applyVerties(result.backVerties);

    startPoint = this.$viewport.applyVertex(result.startPoint);
    endPoint = this.$viewport.applyVertex(result.endPoint);
    areaStartPoint = this.$viewport.applyVertex(result.areaStartPoint);
    areaEndPoint = this.$viewport.applyVertex(result.areaEndPoint);
    centerPosition = this.$viewport.applyVertex(result.centerPosition);
    colorsteps = result.colorsteps.map((it) => {
      it.screenXY = this.$viewport.applyVertex(it.pos);
      return it;
    });

    const lastDist = vec3.dist(centerPosition, endPoint);

    const [stickPoint] = vertiesMap(
      [endPoint],
      calculateRotationOriginMat4(90, vec3.lerp([], startPoint, endPoint, 0.5))
    );

    centerStick = vec3.lerp(
      [],
      centerPosition,
      vec3.lerp(
        [],
        centerPosition,
        stickPoint,
        1 / vec3.dist(centerPosition, stickPoint)
      ),
      lastDist + 20
    );

    const targetStick = vec3.lerp(
      [],
      centerStick,
      centerPosition,
      20 / (lastDist + 20)
    );

    let newHoverColorStepPoint = null;
    if (this.state.hoverColorStep) {
      newHoverColorStepPoint = vec3.lerp(
        [],
        startPoint,
        endPoint,
        this.state.hoverColorStep.percent / 100
      );
    }

    return (
      <svg class="gradient-angle">
        <path
          class="stick"
          d={`
              M ${targetStick[0]} ${targetStick[1]}
              L ${centerStick[0]} ${centerStick[1]}
          `}
        />
        <circle
          class="size"
          cx={centerPosition[0]}
          cy={centerPosition[1]}
          r={vec3.dist(centerPosition, startPoint)}
        ></circle>
        <circle
          class="rotate"
          cx={centerStick[0]}
          cy={centerStick[1]}
          r="7"
          data-center-x={centerPosition[0]}
          data-center-y={centerPosition[1]}
        />
        <path
          d={`
                        M ${areaStartPoint[0]} ${areaStartPoint[1]}
                        L ${areaEndPoint[0]} ${areaEndPoint[1]}
                    `}
          class="area-line"
        />
        <path
          d={`
                        M ${startPoint[0]} ${startPoint[1]}
                        L ${endPoint[0]} ${endPoint[1]}
                    `}
          class="start-end-line"
        />
        {colorsteps.map((it, index) => {
          if (it.cut) {
            return (
              <rect
                id={it.id}
                data-index={index}
                class="colorstep"
                transform={`rotate(${image.angle} ${it.screenXY[0]} ${it.screenXY[1]})`}
                x={it.screenXY[0] - 7}
                y={it.screenXY[1] - 7}
                width={14}
                height={14}
                fill={it.color}
                tabIndex={-1}
              ></rect>
            );
          } else {
            return (
              <rect
                id={it.id}
                data-index={index}
                class="colorstep"
                transform={`rotate(${image.angle} ${it.screenXY[0]} ${it.screenXY[1]})`}
                x={it.screenXY[0] - 7}
                y={it.screenXY[1] - 7}
                rx={7}
                ry={7}
                width={14}
                height={14}
                fill={it.color}
                tabIndex={-1}
              ></rect>
            );
          }
        })}

        {newHoverColorStepPoint && (
          <circle
            class="hover-colorstep"
            r="5"
            cx={newHoverColorStepPoint[0]}
            cy={newHoverColorStepPoint[1]}
            fill={this.state.hoverColorStep.color}
          ></circle>
        )}
      </svg>
    );
  }

  [LOAD("$el") + DOMDIFF]() {
    const current = this.$selection.current;

    if (!current) return "";

    const result = current.createBackgroundImageMatrix(this.state.index);

    // cache
    this.state.lastBackgroundMatrix = result;

    const image = result.backgroundImage.image;

    switch (image.type) {
      case GradientType.LINEAR:
      case GradientType.REPEATING_LINEAR:
        this.state.centerPosition = this.$viewport.applyVertex(
          result.centerPosition
        );
        this.state.startPoint = this.$viewport.applyVertex(result.startPoint);
        this.state.endPoint = this.$viewport.applyVertex(result.endPoint);

        this.state.rotateInverse = calculateRotationOriginMat4(
          -1 * result.backgroundImage.image.angle,
          this.state.centerPosition
        );
        break;
      case GradientType.RADIAL:
      case GradientType.REPEATING_RADIAL:
        this.state.centerPosition = this.$viewport.applyVertex(
          result.radialCenterPosition
        );
        this.state.startPoint = this.$viewport.applyVertex(
          result.radialStartPoint
        );
        this.state.endPoint = this.$viewport.applyVertex(result.radialEndPoint);
        break;
      case GradientType.CONIC:
      case GradientType.REPEATING_CONIC:
        this.state.centerPosition = this.$viewport.applyVertex(
          result.radialCenterPosition
        );
        this.state.startPoint = this.$viewport.applyVertex(
          result.radialShapePoint
        );
        break;
    }

    return (
      <div>
        {this.makeGradientRect(result)}
        {image.type === GradientType.STATIC || image.type === GradientType.IMAGE
          ? null
          : this.makeCenterPoint(result)}
      </div>
    );
  }
}
