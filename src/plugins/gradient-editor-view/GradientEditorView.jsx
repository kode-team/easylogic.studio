import { mat4, vec3 } from "gl-matrix";

import {
  DOMDIFF,
  KEYUP,
  LEFT_BUTTON,
  LOAD,
  POINTERMOVE,
  POINTEROUT,
  POINTERSTART,
  PREVENT,
  SUBSCRIBE,
} from "sapa";

import "./GradientEditorView.scss";

import { CSS_TO_STRING, STRING_TO_CSS } from "elf/core/func";
import {
  calculateAngle360,
  calculateAngleForVec3,
  calculateRotationOriginMat4,
  vertiesMap,
} from "elf/core/math";
import { PathParser } from "elf/editor/parser/PathParser";
import { BackgroundImage } from "elf/editor/property-parser/BackgroundImage";
import { END, MOVE } from "elf/editor/types/event";
import {
  GradientType,
  RadialGradientType,
  TimingFunction,
} from "elf/editor/types/model";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Length } from "elf/editor/unit/Length";
import { parseOneValue } from "elf/utils/css-function-parser";

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

const TOOL_SIZE = 20;

class GradientBaseEditor extends EditorElement {
  initializeData() {
    const value = this.$context.selection.current["background-image"];

    const cssValue = STRING_TO_CSS(value);

    this.state.backgroundImages = BackgroundImage.parseStyle(cssValue);
    this.state.backImages = BackgroundImage.parseStyle(cssValue);
    const current = this.$context.selection.current;
    this.state.gradient = this.state.backImages[this.state.index];
    this.state.contentBox = current.contentBox;
    this.state.backgroundImageMatrix = current.createBackgroundImageMatrix(
      this.state.index
    );
  }

  updateData() {
    var value = CSS_TO_STRING(
      BackgroundImage.toProperty(this.state.backgroundImages)
    );

    this.command(
      "setAttributeForMulti",
      "change background image",
      this.$context.selection.packByValue({
        "background-image": value,
      })
    );
  }
}

class GradientTimingStepEditor extends GradientBaseEditor {
  [POINTERSTART("$el .step-point") +
    MOVE("moveStepPoint") +
    END("moveEndStepPoint")](e) {
    this.$el.toggleClass("dragging", true);
    this.initializeData();
    const colorStepIndex = +e.$dt.data("colorstep-index");

    this.localColorStep =
      this.state.backgroundImages[this.state.index].image.colorsteps[
        colorStepIndex
      ];
    this.localColorStepTimingCount = this.localColorStep.timing.count;
    this.localColorCubicBezierTimingCount = this.localColorStep.timingCount;
  }

  moveStepPoint(dx, dy) {
    const dist =
      (dx < 0 ? -1 : 1) * Math.ceil(vec3.dist([0, 0, 0], [dx, dy, 0]) / 10);

    switch (this.localColorStep.timing.name) {
      case TimingFunction.LINEAR:
        break;
      case TimingFunction.STEPS:
        this.localColorStep.timing.count = Math.max(
          this.localColorStepTimingCount + dist,
          1
        );
        break;
      default:
        this.localColorStep.timingCount = Math.max(
          this.localColorCubicBezierTimingCount + dist,
          1
        );
        break;
    }

    this.updateData();
  }

  makeTimingString(timing) {
    switch (timing.name) {
      case TimingFunction.LINEAR:
        return ``;
      case TimingFunction.EASE:
      case TimingFunction.EASE_IN:
      case TimingFunction.EASE_OUT:
      case TimingFunction.EASE_IN_OUT:
        return `${timing.name}`;
      default:
        return `cubic-bezier(${timing.x1}, ${timing.y1}, ${timing.x2}, ${timing.y2})`;
    }
  }

  moveEndStepPoint(dx, dy) {
    if (dx === 0 && dy === 0) {
      const { timing } = this.localColorStep;

      switch (timing.name) {
        case TimingFunction.STEPS:
          this.localColorStep.timing.direction =
            this.localColorStep.timing.direction === "start" ? "end" : "start";
          break;
        case TimingFunction.LINEAR:
          break;
        case TimingFunction.PATH:
          this.emit("showComponentPopup", {
            title: "Path Editor",
            width: 400,
            inspector: [
              {
                key: "path",
                editor: "path",
                editorOptions: {
                  height: 160,
                },
                defaultValue: timing.d,
              },
            ],
            changeEvent: (key, value) => {
              this.localColorStep.timing = parseOneValue(
                `path(${value})`
              ).parsed;
              this.updateData();
            },
          });

          break;
        default:
          // Cubic Bezier UI 표시를 해봅시다.
          // animation 쪽에 있는것을 가지고 와야 할 것 같네요.
          this.emit("showComponentPopup", {
            title: "Cubic Bezier",
            width: 220,
            inspector: [
              {
                key: "timing",
                editor: "cubic-bezier",
                editorOptions: {
                  isAnimating: false,
                },
                defaultValue: this.makeTimingString(timing),
              },
            ],
            changeEvent: (key, value) => {
              this.localColorStep.timing = parseOneValue(value).parsed;
              this.updateData();
            },
          });
          this.$el.toggleClass("dragging", false);
          return;
      }
    }

    this.updateData();
    this.$el.toggleClass("dragging", false);
  }
}

class GradientResizer extends GradientTimingStepEditor {
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

  calculateMovedResizer() {
    const targetMousePoint = this.$viewport.getWorldPosition();

    // 1. 움직이는 vertex 를 구한다.
    const currentVertex = vec3.clone(this.initMousePoint);
    const nextVertex = targetMousePoint;

    // 3. invert matrix 를 실행해서  기본 좌표로 복귀한다.
    const reverseMatrix = this.$context.selection.current.absoluteMatrixInverse;
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
        shiftKey: this.$config.get("bodyEvent").shiftKey,
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

  calculateMovedRect() {
    const targetMousePoint = this.$viewport.getWorldPosition();

    // 1. 움직이는 vertex 를 구한다.
    const currentVertex = vec3.clone(this.initMousePoint);
    const nextVertex = targetMousePoint;

    // 3. invert matrix 를 실행해서  기본 좌표로 복귀한다.
    // var currentResult = vec3.transformMat4([], currentVertex, reverseMatrix);62849
    // var nextResult = vec3.transformMat4([], nextVertex, reverseMatrix);
    const reverseMatrix = this.$context.selection.current.absoluteMatrixInverse;
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
        this.startPoint = this.$viewport.applyVertex(result.startPoint);
        this.endPoint = this.$viewport.applyVertex(result.endPoint);
        this.screenXY = this.$viewport.applyVertex(
          result.colorsteps[this.$targetIndex].pos
        );

        // eslint-disable-next-line no-case-declarations
        const dist = vec3.subtract([], this.endPoint, this.startPoint);

        // 눞혀진 각은 180 도 이다. 그렇다는 이야기는 회전을 하지 않았다는 의미가 되고 -180 을 해서 다시 0도로 맞춰준다.
        // eslint-disable-next-line no-case-declarations
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
        this.startPoint = this.$viewport.applyVertex(result.shapePoint);
        this.newStartPoint = vec3.subtract(
          [],
          this.startPoint,
          this.centerPosition
        );
        this.newStartAngle = calculateAngle360(
          this.newStartPoint[0],
          this.newStartPoint[1]
        );

        // conic 의 경우 중간 지점에 따라 UI 크기가 달라지기 때문에
        // 마지막 UI 에서 x, y 를 가지고 오도록 한다.
        // eslint-disable-next-line no-case-declarations
        const x = +$colorstep.data("x");
        // eslint-disable-next-line no-case-declarations
        const y = +$colorstep.data("y");
        this.screenXY = [x, y, 0];

        this.endPoint = this.$viewport.applyVertex(result.endPoint);
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
        newDist = Math.max(0, Math.min(100, newDist));
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
        newDist = Math.max(0, Math.min(100, newDist));
        baseDist = vec3.dist(this.startPoint, this.endPoint);
        break;
      case GradientType.CONIC:
      case GradientType.REPEATING_CONIC:
        // eslint-disable-next-line no-case-declarations
        const newNextPoint = vec3.subtract([], nextPoint, this.centerPosition);
        // eslint-disable-next-line no-case-declarations
        let nextAngle = calculateAngle360(newNextPoint[0], newNextPoint[1]);

        if (this.$config.get("bodyEvent").shiftKey) {
          nextAngle -= nextAngle % this.$config.get("fixed.gradient.angle");
        }

        // eslint-disable-next-line no-case-declarations
        let newAngle = nextAngle - this.newStartAngle;

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
      BackgroundImage.toProperty(this.state.backgroundImages)
    );

    this.command(
      "setAttributeForMulti",
      "change background image",
      this.$context.selection.packByValue({
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
      image.colorsteps[this.$targetIndex].toggleTiming();

      const targetColorStep = {
        color: image.colorsteps[this.$targetIndex].color,
        percent: image.colorsteps[this.$targetIndex].percent,
      };

      this.emit("updateGradientEditor", image, targetColorStep);

      var value = CSS_TO_STRING(
        BackgroundImage.toProperty(this.state.backgroundImages)
      );

      this.command(
        "setAttributeForMulti",
        "change background image",
        this.$context.selection.packByValue({
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
      BackgroundImage.toProperty(this.state.backgroundImages)
    );

    this.command(
      "setAttributeForMulti",
      "change background image",
      this.$context.selection.packByValue({
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

  [POINTEROUT("$el .area-line")]() {
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
        // eslint-disable-next-line no-case-declarations
        const newStartPoint = vec3.subtract(
          [],
          this.state.startPoint,
          this.state.centerPosition
        );

        // eslint-disable-next-line no-case-declarations
        const newNextPoint = vec3.subtract(
          [],
          nextPoint,
          this.state.centerPosition
        );

        // eslint-disable-next-line no-case-declarations
        const startAngle = calculateAngle360(
          newStartPoint[0],
          newStartPoint[1]
        );
        // eslint-disable-next-line no-case-declarations
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

  /**
   * 드래그 해서 객체 옮기기
   *
   * ctrl + pointerstart 하는  시점에 카피해보자.
   *
   * @param {PointerEvent} e
   */
  [POINTERSTART("$el .point") +
    LEFT_BUTTON +
    MOVE("calculateMovedElement") +
    END("calculateMovedEndElement") +
    PREVENT](e) {
    this.$el.toggleClass("dragging", true);
    this.initializeData();

    const result = this.state.backgroundImageMatrix;

    this.pointTarget = e.$dt.data("type");
    this.startPoint = this.$viewport.applyVertex(result.startPoint);
    this.endPoint = this.$viewport.applyVertex(result.endPoint);

    if (result.shapePoint) {
      this.shapePoint = this.$viewport.applyVertex(result.shapePoint);
    }
  }

  calculateMovedElement(dx, dy) {
    const targetPoint =
      this.pointTarget === "start" ? this.startPoint : this.endPoint;

    let nextPoint = vec3.add([], targetPoint, [dx, dy, 0]);

    var [localPosition] = vertiesMap(
      [this.$viewport.applyVertexInverse(nextPoint)],
      this.$context.selection.current.absoluteMatrixInverse
    );

    const backgroundImage = this.state.gradient;
    const backRect = backgroundImage.getOffset(this.state.contentBox);
    const image = this.state.gradient.image;

    switch (image.type) {
      case GradientType.RADIAL:
      case GradientType.REPEATING_RADIAL:
        if (this.pointTarget === "start") {
          const newX = localPosition[0] - backRect.x;
          const newY = localPosition[1] - backRect.y;

          this.state.backgroundImages[this.state.index].image.radialPosition = [
            Length.makePercent(newX, backRect.width),
            Length.makePercent(newY, backRect.height),
          ];

          this.updateData();
        } else if (this.pointTarget === "end") {
          var [localStartPosition] = vertiesMap(
            [this.$viewport.applyVertexInverse(this.startPoint)],
            this.$context.selection.current.absoluteMatrixInverse
          );

          var [localEndPosition] = vertiesMap(
            [
              this.$viewport.applyVertexInverse(
                vec3.add([], this.endPoint, [dx, 0, 0])
              ),
            ],
            this.$context.selection.current.absoluteMatrixInverse
          );

          var [localShapePosition] = vertiesMap(
            [this.$viewport.applyVertexInverse(this.shapePoint)],
            this.$context.selection.current.absoluteMatrixInverse
          );

          const newEndX =
            localEndPosition[0] - backRect.x - localStartPosition[0];
          // const newY = localPosition[1] - backRect.y;

          const newShapeY =
            localShapePosition[1] - backRect.y - localStartPosition[1];

          // const newY = localPosition[1] - backRect.y;

          if (
            this.state.gradient.image.radialType === RadialGradientType.CIRCLE
          ) {
            this.state.backgroundImages[this.state.index].image.radialSize = [
              Length.px(Math.abs(newEndX)),
            ];
          } else if (
            this.state.gradient.image.radialType === RadialGradientType.ELLIPSE
          ) {
            this.state.backgroundImages[this.state.index].image.radialSize = [
              Length.makePercent(Math.abs(newEndX), backRect.width),
              Length.makePercent(Math.abs(newShapeY), backRect.height),
            ];
          }

          this.updateData();
        } else if (this.pointTarget === "shape") {
          var [localStartPosition] = vertiesMap(
            [this.$viewport.applyVertexInverse(this.startPoint)],
            this.$context.selection.current.absoluteMatrixInverse
          );

          var [localShapePosition] = vertiesMap(
            [
              this.$viewport.applyVertexInverse(
                vec3.add([], this.shapePoint, [0, dy, 0])
              ),
            ],
            this.$context.selection.current.absoluteMatrixInverse
          );

          var [localEndPosition] = vertiesMap(
            [this.$viewport.applyVertexInverse(this.endPoint)],
            this.$context.selection.current.absoluteMatrixInverse
          );

          const newEndX =
            localEndPosition[0] - backRect.x - localStartPosition[0];
          // const newY = localPosition[1] - backRect.y;

          const newShapeY =
            localShapePosition[1] - backRect.y - localStartPosition[1];

          // const newY = localPosition[1] - backRect.y;

          if (
            this.state.gradient.image.radialType === RadialGradientType.CIRCLE
          ) {
            this.state.backgroundImages[this.state.index].image.radialSize = [
              Length.px(Math.abs(newShapeY)),
            ];
          } else if (
            this.state.gradient.image.radialType === RadialGradientType.ELLIPSE
          ) {
            this.state.backgroundImages[this.state.index].image.radialSize = [
              Length.makePercent(Math.abs(newEndX), backRect.width),
              Length.makePercent(Math.abs(newShapeY), backRect.height),
            ];
          }
          this.updateData();
        }
        break;
      case GradientType.CONIC:
      case GradientType.REPEATING_CONIC:
        if (this.pointTarget === "start") {
          const newX = localPosition[0] - backRect.x;
          const newY = localPosition[1] - backRect.y;

          this.state.backgroundImages[this.state.index].image.radialPosition = [
            Length.makePercent(newX, backRect.width),
            Length.makePercent(newY, backRect.height),
          ];

          this.updateData();
        }

        break;
    }
  }

  calculateMovedEndElement(dx, dy) {
    if (dx == 0 && dy === 0) {
      if (this.pointTarget === "start") {
        // 시작 point 를 클릭 한 시점에 모양을 바꾼다.
        switch (this.state.gradient.type) {
          case GradientType.RADIAL:
          case GradientType.REPEATING_RADIAL:
            // eslint-disable-next-line no-case-declarations
            const findKey =
              `${this.state.gradient.image.radialType} ${this.state.gradient.image.radialSize}`.trim();
            // eslint-disable-next-line no-case-declarations
            const index = radialTypeList.indexOf(findKey);

            // eslint-disable-next-line no-case-declarations
            const [radialType, radialSize] =
              radialTypeList[(index + 1) % radialTypeList.length].split(" ");

            // eslint-disable-next-line no-case-declarations
            const image = this.state.backgroundImages[this.state.index].image;

            image.radialType = radialType;
            image.radialSize = radialSize;
            break;
        }
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
    if (this.$context.selection.current) {
      if (
        this.$context.selection.hasChangedField(
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

  makeTimingLine(timing, width = 10, startX = 0, startY = 0) {
    switch (timing.name) {
      case TimingFunction.LINEAR:
        return ``;
      case TimingFunction.STEPS:
        return (
          <path
            class="timing"
            d={`
          M${startX + 0} ${startY + width} 
          L${startX + (width * 1) / 3} ${startY + width} 
          L${startX + (width * 1) / 3} ${startY + (width * 2) / 3} 
          L${startX + (width * 2) / 3} ${startY + (width * 2) / 3} 
          L${startX + (width * 2) / 3} ${startY + (width * 1) / 3} 
          L${startX + width} ${startY + (width * 1) / 3} 
          L${startX + width} ${startY + 0}           
        `}
          />
        );
      case TimingFunction.PATH:
        return (
          <path
            class="timing"
            d={
              PathParser.fromSVGString(timing.d)
                .scale(width, width)
                .flipX()
                .translate(0, width).d
            }
          />
        );
      default:
        return (
          <path
            class="timing"
            d={`
          M${startX + 0} ${startY + width} 
          C 
            ${startX + timing.x1 * width} ${startY + width - timing.y1 * width} 
            ${startX + timing.x2 * width} ${
              startY + width - timing.y2 * width
            }  
            ${startX + width} ${startY + 0}
        `}
          />
        );
    }
  }

  makeConicTimingLine(timing, width = 10, startX = 0, startY = 0) {
    const half = width / 2;
    switch (timing.name) {
      case TimingFunction.LINEAR:
        return ``;
      case TimingFunction.STEPS:
        return (
          <path
            class="timing"
            d={`
          M${startX + 0 - half} ${startY + width - half} 
          L${startX + (width * 1) / 3 - half} ${startY + width - half} 
          L${startX + (width * 1) / 3 - half} ${
              startY + (width * 2) / 3 - half
            } 
          L${startX + (width * 2) / 3 - half} ${
              startY + (width * 2) / 3 - half
            } 
          L${startX + (width * 2) / 3 - half} ${
              startY + (width * 1) / 3 - half
            } 
          L${startX + width - half} ${startY + (width * 1) / 3 - half} 
          L${startX + width - half} ${startY + 0 - half}           
        `}
          />
        );
      case TimingFunction.PATH:
        return (
          <path
            class="timing"
            d={
              PathParser.fromSVGString(timing.d)
                .scale(width, width)
                .flipX()
                .translate(-half, width).d
            }
          />
        );
      default:
        return (
          <path
            class="timing"
            d={`
          M${startX + 0 - half} ${startY + width - half} 
          C 
            ${startX + timing.x1 * width - half} ${
              startY + width - timing.y1 * width - half
            } 
            ${startX + timing.x2 * width - half} ${
              startY + width - timing.y2 * width - half
            }  
            ${startX + width - half} ${startY + 0 - half}
        `}
          />
        );
    }
  }

  makeTimingCircle(colorstepIndex, current, prev) {
    const prevStickScreenXY = prev.stickScreenXYInEnd;
    const stickScreenXY = current.stickScreenXYInStart;
    const { timing, timingCount } = current;

    let pos;
    switch (timing.name) {
      case TimingFunction.LINEAR:
        return ``;
      case TimingFunction.STEPS:
        pos = vec3.lerp([], prevStickScreenXY, stickScreenXY, 0.5);
        return (
          <>
            <circle
              class="step-point"
              data-colorstep-index={colorstepIndex}
              cx={pos[0]}
              cy={pos[1]}
              r={7}
            />
            <text x={pos[0]} y={pos[1]} dy={4} text-anchor="middle">
              {timing.count}
            </text>
          </>
        );
      default:
        pos = vec3.lerp([], prevStickScreenXY, stickScreenXY, 0.5);
        return (
          <>
            <circle
              class="step-point"
              data-colorstep-index={colorstepIndex}
              cx={pos[0]}
              cy={pos[1]}
              r={7}
            />
            <text x={pos[0]} y={pos[1]} dy={4} text-anchor="middle">
              {timingCount}
            </text>
          </>
        );
    }
  }

  makeConicTimingCircle(startPoint, colorstepIndex, current, prev) {
    const prevStickScreenXY = prev.stickScreenXY;
    const stickScreenXY = current.stickScreenXY;
    const { timing, timingCount } = current;

    const dist = vec3.dist(prevStickScreenXY, startPoint);
    const prevAngle = calculateAngle360(
      ...vec3.subtract([], prevStickScreenXY, startPoint)
    );
    const angle = calculateAngle360(
      ...vec3.subtract([], stickScreenXY, startPoint)
    );

    let nextAngle = this.getRealAngle(prevAngle + (angle - prevAngle) / 2);
    const bigArc = Math.abs(angle - prevAngle) % 360 >= 180 ? 1 : 0;

    if (bigArc) {
      nextAngle -= 180;
    }

    var [pos] = vertiesMap(
      [vec3.lerp([], startPoint, vec3.add([], startPoint, [-1, 0, 0]), dist)],
      calculateRotationOriginMat4(nextAngle, startPoint)
    );

    switch (timing.name) {
      case TimingFunction.LINEAR:
        return ``;
      case TimingFunction.STEPS:
        return (
          <>
            <circle
              class="step-point"
              data-colorstep-index={colorstepIndex}
              cx={pos[0]}
              cy={pos[1]}
              r={7}
            />
            <text x={pos[0]} y={pos[1]} dy={4} text-anchor="middle">
              {timing.count}
            </text>
          </>
        );
      default:
        return (
          <>
            <circle
              class="step-point"
              data-colorstep-index={colorstepIndex}
              cx={pos[0]}
              cy={pos[1]}
              r={7}
            />
            <text x={pos[0]} y={pos[1]} dy={4} text-anchor="middle">
              {timingCount}
            </text>
          </>
        );
    }
  }

  makeTimingArea(colorstepIndex, current, prev, size) {
    const prevStickScreenXY = prev.stickScreenXYInEnd;
    const stickScreenXY = current.stickScreenXYInStart;

    return (
      <g class="timing-area">
        {current.timing.name === TimingFunction.LINEAR ? (
          ``
        ) : (
          <path
            class="timing-path"
            d={`
              M ${prevStickScreenXY[0]} ${prevStickScreenXY[1]}
              L ${stickScreenXY[0]} ${stickScreenXY[1]}
            `}
          />
        )}

        {this.makeTimingCircle(colorstepIndex, current, prev, size)}
      </g>
    );
  }

  getRealAngle(angle) {
    return angle < 0 ? 360 + angle : angle;
  }

  makeConicTimingArea(
    startPoint,
    colorstepIndex,
    current,
    prev,
    size,
    dist,
    startAngle
  ) {
    const prevStickScreenXY = prev.stickScreenXY;
    const stickScreenXY = current.stickScreenXY;

    const prevAngle =
      calculateAngle360(...vec3.subtract([], prevStickScreenXY, startPoint)) +
      startAngle;
    const angle =
      calculateAngle360(...vec3.subtract([], stickScreenXY, startPoint)) +
      startAngle;

    const nextAngle = 360 - prevAngle;
    const nextAngle2 = angle;

    const bigArc = Math.abs(nextAngle + nextAngle2) % 360 >= 180 ? 1 : 0;

    return (
      <g class="timing-area">
        {current.timing.name === TimingFunction.LINEAR ? (
          ``
        ) : (
          <>
            <path
              class="timing-path"
              d={`
              M ${prevStickScreenXY[0]} ${prevStickScreenXY[1]}
              A ${dist} ${dist} 0 ${bigArc} 1 ${stickScreenXY[0]} ${stickScreenXY[1]}
            `}
            />
          </>
        )}

        {this.makeConicTimingCircle(
          startPoint,
          colorstepIndex,
          current,
          prev,
          dist
        )}
      </g>
    );
  }

  makeGradientPoint(
    colorsteps,
    startPoint,
    endPoint,
    shapePoint,
    newHoverColorStepPoint
  ) {
    const size = TOOL_SIZE;
    const dist = vec3.subtract([], endPoint, startPoint);
    const angle = calculateAngle360(dist[0], dist[1]) - 180;
    return (
      <>
        {colorsteps.map((it, index) => {
          if (index === 0) return "";

          return this.makeTimingArea(
            index,
            it,
            colorsteps[index - 1],
            TOOL_SIZE
          );
        })}
        {colorsteps.map((it, index) => {
          return (
            <g
              transform={`rotate(${angle} ${it.stickScreenXY[0]} ${it.stickScreenXY[1]})`}
            >
              <rect
                id={it.id}
                data-index={index}
                class="colorstep"
                x={it.stickScreenXY[0]}
                y={it.stickScreenXY[1]}
                width={size}
                height={size}
                fill={it.color}
                tabIndex={-1}
                data-x={it.screenXY[0]}
                data-y={it.screenXY[1]}
              ></rect>
              {this.makeTimingLine(
                it.timing,
                size,
                it.stickScreenXY[0],
                it.stickScreenXY[1]
              )}
            </g>
          );
        })}

        <circle
          class="point"
          data-type="start"
          cx={startPoint[0]}
          cy={startPoint[1]}
        ></circle>
        <circle
          class="point"
          data-type="end"
          cx={endPoint[0]}
          cy={endPoint[1]}
        ></circle>
        {shapePoint && (
          <circle
            class="point"
            data-type="shape"
            cx={shapePoint[0]}
            cy={shapePoint[1]}
          ></circle>
        )}
        {newHoverColorStepPoint && (
          <circle
            class="hover-colorstep"
            r="5"
            cx={newHoverColorStepPoint[0]}
            cy={newHoverColorStepPoint[1]}
            fill={this.state.hoverColorStep.color}
          ></circle>
        )}
      </>
    );
  }

  makeConicGradientPoint(
    colorsteps,
    startPoint,
    endPoint,
    shapePoint,
    newHoverColorStepPoint,
    dist,
    startAngle
  ) {
    const size = TOOL_SIZE;

    return (
      <>
        {colorsteps.map((it, index) => {
          if (index === 0) return "";

          return this.makeConicTimingArea(
            startPoint,
            index,
            it,
            colorsteps[index - 1],
            TOOL_SIZE,
            dist,
            startAngle
          );
        })}
        {colorsteps.map((it, index) => {
          const angle =
            calculateAngle360(...vec3.subtract([], it.screenXY, startPoint)) -
            180;
          return (
            <g
              transform={`rotate(${angle} ${it.screenXY[0]} ${it.screenXY[1]})`}
            >
              <rect
                id={it.id}
                data-index={index}
                class="colorstep"
                x={it.screenXY[0] - size / 2}
                y={it.screenXY[1] - size / 2}
                width={size}
                height={size}
                fill={it.color}
                tabIndex={-1}
                data-x={it.screenXY[0]}
                data-y={it.screenXY[1]}
              ></rect>
              {this.makeConicTimingLine(
                it.timing,
                size,
                it.screenXY[0],
                it.screenXY[1],
                startAngle
              )}
            </g>
          );
        })}

        <circle
          class="point"
          data-type="start"
          cx={startPoint[0]}
          cy={startPoint[1]}
        ></circle>
        <circle
          class="point"
          data-type="end"
          cx={endPoint[0]}
          cy={endPoint[1]}
        ></circle>
        {shapePoint && (
          <circle
            class="point"
            data-type="shape"
            cx={shapePoint[0]}
            cy={shapePoint[1]}
          ></circle>
        )}
        {newHoverColorStepPoint && (
          <circle
            class="hover-colorstep"
            r="5"
            cx={newHoverColorStepPoint[0]}
            cy={newHoverColorStepPoint[1]}
            fill={this.state.hoverColorStep.color}
          ></circle>
        )}
      </>
    );
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

    let centerPosition, centerStick;
    let startPoint, endPoint, shapePoint, colorsteps;

    // radial, conic
    centerPosition = this.$viewport.applyVertex(result.radialCenterPosition);
    startPoint = this.$viewport.applyVertex(result.startPoint);
    endPoint = this.$viewport.applyVertex(result.endPoint);
    shapePoint = this.$viewport.applyVertex(result.shapePoint);

    let lastDist = vec3.dist(startPoint, endPoint) / 2;

    if (lastDist < 50) {
      lastDist = 50;
    }

    colorsteps = result.colorsteps.map((it) => {
      it.screenXY = this.$viewport.applyVertex(it.pos);
      const pointDist = vec3.dist(it.screenXY, startPoint);
      if (pointDist < lastDist) {
        it.screenXY = vec3.lerp(
          [],
          startPoint,
          vec3.lerp([], startPoint, it.screenXY, 1 / pointDist),
          lastDist + 20
        );
      } else if (pointDist > lastDist) {
        it.screenXY = vec3.lerp(
          [],
          startPoint,
          it.screenXY,
          (lastDist + 20) / pointDist
        );
      }

      it.stickScreenXY = vec3.clone(it.screenXY);

      const dist = vec3.subtract([], it.screenXY, startPoint);
      it.angle = calculateAngle360(dist[0], dist[1]);

      return it;
    });

    // radial, conic
    centerPosition = this.$viewport.applyVertex(result.radialCenterPosition);
    const stickPoint = this.$viewport.applyVertex(result.shapePoint);

    centerStick = vec3.lerp(
      [],
      centerPosition,
      vec3.lerp(
        [],
        centerPosition,
        stickPoint,
        1 / vec3.dist(centerPosition, stickPoint)
      ),
      lastDist + 50
    );

    const targetStick = vec3.lerp([], centerStick, centerPosition, 1);

    let newHoverColorStepPoint = null;
    if (this.state.hoverColorStep) {
      const hoverAngle = this.state.hoverColorStep.percent * 3.6;
      const originDist = vec3.dist(centerPosition, shapePoint);
      [newHoverColorStepPoint] = vertiesMap(
        [
          vec3.lerp(
            [],
            centerPosition,
            shapePoint,
            (lastDist + 20) / originDist
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
            cx={startPoint[0]}
            cy={startPoint[1]}
            r={lastDist}
          />
          <circle
            class="area-line"
            cx={startPoint[0]}
            cy={startPoint[1]}
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
          {this.makeConicGradientPoint(
            colorsteps,
            startPoint,
            endPoint,
            shapePoint,
            newHoverColorStepPoint,
            lastDist + 20,
            image.angle
          )}
        </svg>
      </>
    );
  }

  makeRadialCenterPoint(result) {
    // const { image } = result.backgroundImage;

    let colorsteps, startPoint, endPoint, shapePoint;

    startPoint = this.$viewport.applyVertex(result.startPoint);
    endPoint = this.$viewport.applyVertex(result.endPoint);
    shapePoint = this.$viewport.applyVertex(result.shapePoint);

    colorsteps = this.makeStickPoint(result.colorsteps, startPoint, endPoint);

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
      <>
        {/* <div
          class="gradient-position center"
          data-radial-type={image.radialType}
          style={{
            left: Length.px(centerPosition[0]),
            top: Length.px(centerPosition[1]),
          }}
        ></div> */}

        <svg class="gradient-radial-line">
          <path
            d={`
              M ${startPoint[0]} ${startPoint[1]}
              L ${endPoint[0]} ${endPoint[1]}
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
          <path
            d={`
              M ${startPoint[0]} ${startPoint[1]}
              L ${shapePoint[0]} ${shapePoint[1]}
          `}
            class="shape-line"
          />
          {this.makeGradientPoint(
            colorsteps,
            startPoint,
            endPoint,
            shapePoint,
            newHoverColorStepPoint
          )}
        </svg>
      </>
    );
  }

  makeStickPoint(colorsteps, startPoint, endPoint) {
    // console.log(colorsteps, startPoint, endPoint);
    const size = TOOL_SIZE;
    // angle 새로 구하기
    const dist = vec3.subtract([], endPoint, startPoint);
    const angle = calculateAngle360(dist[0], dist[1]) - 180;

    const rotateInverse = calculateRotationOriginMat4(-angle, startPoint);
    const rotateInverseInverse = mat4.invert([], rotateInverse);

    return colorsteps.map((it) => {
      it.screenXY = this.$viewport.applyVertex(it.pos);

      // 수평으로 만들고
      const [newScreenXY] = vertiesMap([it.screenXY], rotateInverse);

      // 거기서 위치를 조정하고
      [it.stickScreenXY, it.stickScreenXYInStart, it.stickScreenXYInEnd] =
        vertiesMap(
          [
            [newScreenXY[0] - size / 2, newScreenXY[1] - size * 1.5, 0],
            [
              newScreenXY[0] - size / 2,
              newScreenXY[1] - size * 1.5 + size / 2,
              0,
            ],
            [
              newScreenXY[0] + size / 2,
              newScreenXY[1] - size * 1.5 + size / 2,
              0,
            ],
          ],

          rotateInverseInverse
        );
      return it;
    });
  }

  makeLinearCenterPoint(result) {
    // console.log(result);
    let centerPosition,
      centerStick,
      startPoint,
      endPoint,
      areaStartPoint,
      areaEndPoint,
      colorsteps;

    // boxPosition = this.$viewport.applyVerties(result.backVerties);

    startPoint = this.$viewport.applyVertex(result.startPoint);
    endPoint = this.$viewport.applyVertex(result.endPoint);
    areaStartPoint = this.$viewport.applyVertex(result.areaStartPoint);
    areaEndPoint = this.$viewport.applyVertex(result.areaEndPoint);
    centerPosition = this.$viewport.applyVertex(result.centerPosition);

    colorsteps = this.makeStickPoint(result.colorsteps, startPoint, endPoint);

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
        {this.makeGradientPoint(
          colorsteps,
          startPoint,
          endPoint,
          null,
          newHoverColorStepPoint
        )}
      </svg>
    );
  }

  [LOAD("$el") + DOMDIFF]() {
    const current = this.$context.selection.current;

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
        this.state.startPoint = this.$viewport.applyVertex(result.startPoint);
        this.state.endPoint = this.$viewport.applyVertex(result.endPoint);
        break;
      case GradientType.CONIC:
      case GradientType.REPEATING_CONIC:
        this.state.centerPosition = this.$viewport.applyVertex(
          result.radialCenterPosition
        );
        this.state.startPoint = this.$viewport.applyVertex(result.shapePoint);
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
