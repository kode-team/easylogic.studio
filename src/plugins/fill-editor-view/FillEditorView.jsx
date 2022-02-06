import {
  DOMDIFF,
  KEYUP,
  LOAD,
  POINTERMOVE,
  POINTEROUT,
  POINTERSTART,
  SUBSCRIBE,
} from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import "./FillEditorView.scss";
import {
  GradientType,
  RadialGradientType,
  SpreadMethodType,
  TimingFunction,
} from "el/editor/types/model";
import { mat4, vec3 } from "gl-matrix";
import {
  calculateAngle360,
  calculateRotationOriginMat4,
  vertiesMap,
} from "el/utils/math";
import { END, MOVE } from "el/editor/types/event";
import { Length } from "el/editor/unit/Length";
import { repeat } from "el/utils/func";

const spreadMethodList = [
  SpreadMethodType.PAD,
  SpreadMethodType.REFLECT,
  SpreadMethodType.REPEAT,
];

const TOOL_SIZE = 20;

/**
 * Fill Editor View
 *
 * SVG에 있는 fill,stroke 의 Fragment 를 시각적으로 보여줍니다.
 *
 */

class FillBaseEditor extends EditorElement {
  initializeData() {
    const current = this.$selection.current;

    this.state.currentMatrix = current.matrix;
    this.state.imageResult = current.createFragmentMatrix(this.state.key);
    this.state.originalResult = current.createFragmentMatrix(this.state.key);
  }
}

class FillTimingStepEditor extends FillBaseEditor {
  [POINTERSTART("$el .step-point") +
    MOVE("moveStepPoint") +
    END("moveEndStepPoint")](e) {
    this.$el.toggleClass("dragging", true);
    this.initializeData();
    const colorStepIndex = +e.$dt.data("colorstep-index");

    this.localColorStep =
      this.state.imageResult.image.colorsteps[colorStepIndex];
    this.localColorStepTimingCount = this.localColorStep.timing.count;
  }

  moveStepPoint(dx, dy) {
    const dist =
      (dx < 0 ? -1 : 1) * Math.ceil(vec3.dist([0, 0, 0], [dx, dy, 0]) / 10);

    this.localColorStep.timing.count = Math.max(
      this.localColorStepTimingCount + dist,
      1
    );

    this.command(
      "setAttributeForMulti",
      `change ${this.state.key} fragment`,
      this.$selection.packByValue({
        [this.state.key]: `${this.state.imageResult.image}`,
      })
    );
  }

  moveEndStepPoint(dx, dy) {

    if (dx === 0 && dy === 0) {
      const {timing, timingCount}  = this.localColorStep

      switch(timing.name) {
        case TimingFunction.STEPS:
        case TimingFunction.LINEAR:
          break;
        default: 
          // Cubic Bezier UI 표시를 해봅시다. 
          // animation 쪽에 있는것을 가지고 와야 할 것 같네요. 
        return;        
      }

    }

    this.command(
      "setAttributeForMulti",
      `change ${this.state.key} fragment`,
      this.$selection.packByValue({
        [this.state.key]: `${this.state.imageResult.image}`,
      })
    );
    this.$el.toggleClass("dragging", false);
  }
}

class FillColorstepEditor extends FillTimingStepEditor {
  [KEYUP("$el .colorstep")](e) {
    const index = +e.$dt.data("index");
    console.log(index);
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


    console.log(currentIndex);
    const image = this.state.imageResult.image;
    image.removeColorStepByIndex(currentIndex);

    this.updateColorStepStatus(image, -1);
  }

  sortToRight() {
    const image = this.state.imageResult.image;
    image.sortToRight();

    this.updateColorStepStatus(image, -1);
  }

  sortToLeft() {
    const image = this.state.imageResult.image;
    image.sortToLeft();

    this.updateColorStepStatus(image, -1);
  }

  appendColorStep(currentIndex) {
    const nextIndex = currentIndex + 1;
    const image = this.state.imageResult.image;

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
    const image = this.state.imageResult.image;
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

  [POINTERSTART("$el .point") + MOVE("movePoint") + END("moveEndPoint")](e) {
    this.$el.toggleClass("dragging", true);
    this.initializeData();

    const result = this.state.imageResult;

    this.pointTarget = e.$dt.data("type");
    this.startPoint = this.$viewport.applyVertex(result.startPoint);
    this.endPoint = this.$viewport.applyVertex(result.endPoint);
    // this.areaStartPoint = this.$viewport.applyVertex(result.areaStartPoint);

    this.dist = vec3.dist(this.startPoint, this.endPoint);

    if (result.shapePoint) {
      this.shapePoint = this.$viewport.applyVertex(result.shapePoint);
      this.shapeDist = vec3.dist(this.startPoint, this.shapePoint);
    }
  }

  calculateNextPoint(nextPoint) {
    // shiftKey 를 누르고 있는 상태면 등간격으로 이동한다.
    if (this.$config.get("bodyEvent").shiftKey) {
      let tempStartPoint, tempEndPoint;
      if (this.pointTarget === "start") {
        tempStartPoint = this.endPoint;
        tempEndPoint = nextPoint;
      } else {
        tempStartPoint = this.startPoint;
        tempEndPoint = nextPoint;
      }

      // angle 을 구하고
      const newDist = vec3.subtract([], tempEndPoint, tempStartPoint);
      let newAngle = calculateAngle360(newDist[0], newDist[1]) - 90;

      // 360 기준으로 숫자를 맞추지 않으면 +,- 값에 의해서 나머지가 엄청 차이나는 결과를 가지게 된다. 
      newAngle = (newAngle + 360) % 360;
      newAngle -= newAngle % this.$config.get("fixed.gradient.angle");

      nextPoint = vertiesMap(
        [vec3.add([], tempStartPoint, [0, -this.dist, 0])],
        calculateRotationOriginMat4(newAngle, tempStartPoint)
      )[0];
    }

    return nextPoint;
  }

  moveShapePoint(dx, dy) {
    const targetPoint = this.shapePoint;
    const nextPoint = this.calculateNextPoint(
      vec3.add([], targetPoint, [dx, dy, 0])
    );
    const width = this.state.currentMatrix.width;
    const height = this.state.currentMatrix.height;

    const image = this.state.imageResult.image;

    let newX, newY;
    switch (image.type) {
      case GradientType.RADIAL:
        const dist = vec3.dist(this.startPoint, nextPoint);

        const lastPoint = vec3.lerp(
          [],
          this.startPoint,
          this.shapePoint,
          dist / this.shapeDist
        );

        const [worldPosition] = vertiesMap(
          [this.$viewport.applyVertexInverse(lastPoint)],
          this.state.currentMatrix.absoluteMatrixInverse
        );

        newX = Length.makePercent(worldPosition[0], width);
        newY = Length.makePercent(worldPosition[1], height);

        image.reset({
          x3: newX,
          y3: newY,
        });

        break;
    }

    this.command(
      "setAttributeForMulti",
      `change ${this.state.key} fragment`,
      this.$selection.packByValue({
        [this.state.key]: `${this.state.imageResult.image}`,
      })
    );
  }

  movePoint(dx, dy) {
    if (this.pointTarget === "shape") {
      return this.moveShapePoint(dx, dy);
    }

    const targetPoint =
      this.pointTarget === "start" ? this.startPoint : this.endPoint;
    let nextPoint = this.calculateNextPoint(
      vec3.add([], targetPoint, [dx, dy, 0])
    );

    var [worldPosition] = vertiesMap(
      [this.$viewport.applyVertexInverse(nextPoint)],
      this.state.currentMatrix.absoluteMatrixInverse
    );

    const width = this.state.currentMatrix.width;
    const height = this.state.currentMatrix.height;

    const image = this.state.imageResult.image;

    switch (image.type) {
      case GradientType.RADIAL:
        var newX, newY, newX2, newY2, newX3, newY3;
        if (this.pointTarget === "start") {
          newX = image.x1.isPercent()
            ? Length.makePercent(worldPosition[0], width)
            : Length.px(worldPosition[0]);
          newY = image.y1.isPercent()
            ? Length.makePercent(worldPosition[1], height)
            : Length.px(worldPosition[1]);

          // end point 도 같이 옮기기
          const nextEndPoint = this.calculateNextPoint(
            vec3.add([], this.endPoint, [dx, dy, 0])
          );
          const [newEndPosition] = vertiesMap(
            [this.$viewport.applyVertexInverse(nextEndPoint)],
            this.state.currentMatrix.absoluteMatrixInverse
          );

          newX2 = image.x2.isPercent()
            ? Length.makePercent(newEndPosition[0], width)
            : Length.px(newEndPosition[0]);
          newY2 = image.y2.isPercent()
            ? Length.makePercent(newEndPosition[1], height)
            : Length.px(newEndPosition[1]);

          // shape point 도 같이 옮기기
          const nextShapePoint = this.calculateNextPoint(
            vec3.add([], this.shapePoint, [dx, dy, 0])
          );
          const [newShapePosition] = vertiesMap(
            [this.$viewport.applyVertexInverse(nextShapePoint)],
            this.state.currentMatrix.absoluteMatrixInverse
          );

          newX3 = image.x3.isPercent()
            ? Length.makePercent(newShapePosition[0], width)
            : Length.px(newShapePosition[0]);
          newY3 = image.y3.isPercent()
            ? Length.makePercent(newShapePosition[1], height)
            : Length.px(newShapePosition[1]);

          image.reset({
            x1: newX,
            y1: newY,
            x2: newX2,
            y2: newY2,
            x3: newX3,
            y3: newY3,
          });
        } else if (this.pointTarget === "end") {
          if (this.$config.get("bodyEvent").altKey) {
            // 각을 유지한채로 크기만 변경한다.

            const dist = vec3.dist(this.startPoint, nextPoint);
            nextPoint = vec3.lerp(
              [],
              this.startPoint,
              this.endPoint,
              dist / this.dist
            );

            var [worldPosition] = vertiesMap(
              [this.$viewport.applyVertexInverse(nextPoint)],
              this.state.currentMatrix.absoluteMatrixInverse
            );
          }

          newX = Length.makePercent(worldPosition[0], width);
          newY = Length.makePercent(worldPosition[1], height);

          image.reset({
            x2: newX,
            y2: newY,
          });

          const lastDist = vec3.dist(this.startPoint, nextPoint);

          const unitVector = vec3.lerp(
            [],
            this.startPoint,
            nextPoint,
            1 / lastDist
          );

          const nextShapePoint = vec3.lerp(
            [],
            this.startPoint,
            vertiesMap(
              [unitVector],
              calculateRotationOriginMat4(90, this.startPoint)
            )[0],
            image.radialType === RadialGradientType.CIRCLE
              ? lastDist
              : this.shapeDist
          );

          const [newShapePosition] = vertiesMap(
            [this.$viewport.applyVertexInverse(nextShapePoint)],
            this.state.currentMatrix.absoluteMatrixInverse
          );

          newX3 = Length.makePercent(newShapePosition[0], width);
          newY3 = Length.makePercent(newShapePosition[1], height);

          image.reset({
            x3: newX3,
            y3: newY3,
          });
        }
        break;

      case GradientType.LINEAR:
        var newX, newY;
        if (this.pointTarget === "start") {
          newX = image.x1.isPercent()
            ? Length.makePercent(worldPosition[0], width)
            : Length.px(worldPosition[0]);
          newY = image.y1.isPercent()
            ? Length.makePercent(worldPosition[1], height)
            : Length.px(worldPosition[1]);

          image.reset({
            x1: newX,
            y1: newY,
          });
        } else if (this.pointTarget === "end") {
          newX = image.x2.isPercent()
            ? Length.makePercent(worldPosition[0], width)
            : Length.px(worldPosition[0]);
          newY = image.y2.isPercent()
            ? Length.makePercent(worldPosition[1], height)
            : Length.px(worldPosition[1]);

          image.reset({
            x2: newX,
            y2: newY,
          });
        }
        break;
    }

    this.command(
      "setAttributeForMulti",
      `change ${this.state.key} fragment`,
      this.$selection.packByValue({
        [this.state.key]: `${this.state.imageResult.image}`,
      })
    );
  }

  moveEndPoint(dx, dy) {
    const image = this.state.imageResult.image;
    const width = this.state.currentMatrix.width;
    const height = this.state.currentMatrix.height;
    if (dx === 0 && dy === 0) {
      switch (image.type) {
        case GradientType.RADIAL:
          if (this.pointTarget === "start") {
            switch (image.radialType) {
              case RadialGradientType.CIRCLE:
                image.reset({
                  radialType: RadialGradientType.ELLIPSE,
                });
                break;
              case RadialGradientType.ELLIPSE:
                const lastDist = vec3.dist(this.startPoint, this.endPoint);

                const unitVector = vec3.lerp(
                  [],
                  this.startPoint,
                  this.endPoint,
                  1 / lastDist
                );

                const nextShapePoint = vec3.lerp(
                  [],
                  this.startPoint,
                  vertiesMap(
                    [unitVector],
                    calculateRotationOriginMat4(90, this.startPoint)
                  )[0],
                  lastDist
                );

                const [newShapePosition] = vertiesMap(
                  [this.$viewport.applyVertexInverse(nextShapePoint)],
                  this.state.currentMatrix.absoluteMatrixInverse
                );

                const x3 = Length.makePercent(newShapePosition[0], width);
                const y3 = Length.makePercent(newShapePosition[1], height);

                image.reset({
                  radialType: RadialGradientType.CIRCLE,
                  x3,
                  y3,
                });
                break;
            }

            break;
          }

        default:
          const index = spreadMethodList.findIndex(
            (it) => image.spreadMethod === it
          );
          const nextIndex = (index + 1) % spreadMethodList.length;

          image.reset({
            spreadMethod: spreadMethodList[nextIndex],
          });
          break;
      }
    }

    this.emit("updateFillEditor", image);
    this.command(
      "setAttributeForMulti",
      `change ${this.state.key} fragment`,
      this.$selection.packByValue({
        [this.state.key]: `${image}`,
      })
    );
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

    const result = this.state.imageResult;

    switch (result.image.type) {
      case GradientType.RADIAL:
      case GradientType.LINEAR:
        this.startPoint = this.$viewport.applyVertex(result.startPoint);
        this.endPoint = this.$viewport.applyVertex(result.endPoint);

        // conic 의 경우 중간 지점에 따라 UI 크기가 달라지기 때문에
        // 마지막 UI 에서 x, y 를 가지고 오도록 한다.
        const x = +$colorstep.data("x");
        const y = +$colorstep.data("y");
        this.screenXY = [x, y, 0];

        const dist = vec3.subtract([], this.endPoint, this.startPoint);
        // 눞혀진 각은 180 도 이다. 그렇다는 이야기는 회전을 하지 않았다는 의미가 되고 -180 을 해서 다시 0도로 맞춰준다.
        const angle = calculateAngle360(dist[0], dist[1]) - 180;

        this.rotateInverse = calculateRotationOriginMat4(
          -angle,
          this.startPoint
        );
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

    const result = this.state.imageResult;
    let newDist = 0;
    let baseDist = 0;

    switch (result.image.type) {
      case GradientType.RADIAL:
      case GradientType.LINEAR:
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
        baseDist = baseDefaultDist;
        break;
    }

    const image = this.state.imageResult.image;
    image.colorsteps[this.$targetIndex].setValue(newDist, baseDist);

    const targetColorStep = {
      color: image.colorsteps[this.$targetIndex].color,
      percent: image.colorsteps[this.$targetIndex].percent,
    };

    const nextImage = this.state.originalResult.image;
    nextImage.colorsteps = image.colorsteps.map((it) => {
      return it;
    });
    nextImage.sortColorStep();

    this.emit("updateFillEditor", nextImage, targetColorStep);

    this.command(
      "setAttributeForMulti",
      `change ${this.state.key} fragment`,
      this.$selection.packByValue({
        [this.state.key]: `${nextImage}`,
      })
    );
  }

  moveEndColorStep(dx, dy) {
    if (this.state.altKey) {
      this.state.altKey = false;
      return;
    }

    if (dx === 0 && dy === 0) {
      const image = this.state.imageResult.image;
      image.colorsteps[this.$targetIndex].toggleTiming();

      const targetColorStep = {
        color: image.colorsteps[this.$targetIndex].color,
        percent: image.colorsteps[this.$targetIndex].percent,
      };

      this.emit("updateFillEditor", image, targetColorStep);

      this.command(
        "setAttributeForMulti",
        "change background image",
        this.$selection.packByValue({
          [this.state.key]: `${image}`,
        })
      );
    }

    this.$el.toggleClass("dragging", false);
  }

  updateColorStepStatus(image, index) {
    this.initializeData();

    const { color, percent } = image.colorsteps[index] || {};
    this.emit("updateFillEditor", image, { color, percent });

    this.command(
      "setAttributeForMulti",
      "change background image",
      this.$selection.packByValue({
        [this.state.key]: `${image}`,
      })
    );
    this.state.hoverColorStep = null;
  }

  [POINTERSTART("$el .area-line")]() {
    const image = this.state.originalResult.image;

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

    const image = this.state.originalResult.image;

    let baseStartPoint, baseEndPoint, baseNextPoint;

    switch (image.type) {
      case GradientType.LINEAR:
      case GradientType.RADIAL:
        [baseStartPoint, baseEndPoint, baseNextPoint] = vertiesMap(
          [this.state.startPoint, this.state.endPoint, nextPoint],
          this.state.rotateInverse
        );

        var [s, e, n] = [baseStartPoint[0], baseEndPoint[0], baseNextPoint[0]];
        var baseDefaultDist = Math.abs(s - e);
        var newDist;
        if (n < s) {
          // startPoint 보다 왼쪽에 있는 경우
          newDist = ((-1 * Math.abs(n - s)) / baseDefaultDist) * 100;
        } else if (n > e) {
          newDist = (Math.abs(n - s) / baseDefaultDist) * 100;
        } else {
          newDist = ((n - s) / baseDefaultDist) * 100;
        }
        this.state.hoverColorStep = image.pickColorStep(newDist);
        break;
    }

    this.refresh();
  }
}

export default class FillEditorView extends FillColorstepEditor {
  initState() {
    return {
      key: "",
      value: "",
      isShow: false,
    };
  }

  template() {
    return <div class="elf--fill-editor-view"></div>;
  }

  updateData() {
    this.trigger(this.state.onchange, this.state.key, this.state.value);
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
          "fill",
          "stroke"
        )
      ) {
        this.refresh();
      }
    }
  }

  [SUBSCRIBE("showFillEditorView")](params = {}) {
    this.setState({
      key: params.key,
      isShow: true,
      onchange: params.onchange,
    });

    this.$el.show();

    this.emit("push.mode.view", "FillEditorView");    
  }

  [SUBSCRIBE("hideFillEditorView")]() {
    this.setState({
      key: "",
      isShow: false,
      onchange: null,
    });
    this.$el.hide();

    this.emit("pop.mode.view", "FillEditorView");    
  }

  makeTimingLine(timing, width = 10, startX = 0, startY = 0) {
    switch (timing.name) {
      case TimingFunction.LINEAR:
        return ``;
      case TimingFunction.STEPS:
        const half = width / 2;
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

  makeTimingCircle(colorstepIndex, current, prev, size) {
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

  makeGradientPoint(colorsteps, startPoint, endPoint, shapePoint, newHoverColorStepPoint) {
    const size = TOOL_SIZE;
    const dist = vec3.subtract([], endPoint, startPoint);
    const angle = calculateAngle360(dist[0], dist[1]) - 180;    
    return (
      <>
        {colorsteps.map((it, index) => {
          if (index === 0) return "";

          return this.makeTimingArea(index, it, colorsteps[index - 1], TOOL_SIZE);
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
        <circle
          class="point"
          data-type="shape"
          cx={shapePoint[0]}
          cy={shapePoint[1]}
        ></circle>        
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

  makeStickPoint(colorsteps, startPoint, endPoint) {
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

  makeRadialCenterPoint(result) {
    let startPoint, endPoint, shapePoint, colorsteps;

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
      <svg class="gradient-editor-area">
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
          class="normal-line"
        />
        {this.makeGradientPoint(
          colorsteps,
          startPoint,
          endPoint,
          shapePoint,
          newHoverColorStepPoint
        )}
      </svg>
    );
  }

  makeLinearCenterPoint(result) {
    let startPoint, endPoint, colorsteps;

    startPoint = this.$viewport.applyVertex(result.startPoint);
    endPoint = this.$viewport.applyVertex(result.endPoint);

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
      <svg class="gradient-editor-area">
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

  makeCenterPoint(result) {
    const { image } = result;

    switch (image.type) {
      case GradientType.LINEAR:
        return this.makeLinearCenterPoint(result);
      case GradientType.RADIAL:
        return this.makeRadialCenterPoint(result);
    }

    return "";
  }

  [LOAD("$el") + DOMDIFF]() {
    if (!this.state.isShow) return "";

    const current = this.$selection.current;

    if (!current) return "";

    const result = current.createFragmentMatrix(this.state.key);

    this.state.result = result;
    this.state.originalResult = current.createFragmentMatrix(this.state.key);

    const image = result.image;

    let angle, dist;

    switch (image.type) {
      case GradientType.LINEAR:
        this.state.startPoint = this.$viewport.applyVertex(result.startPoint);
        this.state.endPoint = this.$viewport.applyVertex(result.endPoint);

        dist = vec3.subtract([], this.state.endPoint, this.state.startPoint);
        angle = calculateAngle360(dist[0], dist[1]) - 180;

        this.state.rotateInverse = calculateRotationOriginMat4(
          -angle,
          this.state.startPoint
        );
        break;
      case GradientType.RADIAL:
        this.state.startPoint = this.$viewport.applyVertex(result.startPoint);
        this.state.endPoint = this.$viewport.applyVertex(result.endPoint);
        this.state.shapePoint = this.$viewport.applyVertex(result.shapePoint);

        dist = vec3.subtract([], this.state.endPoint, this.state.startPoint);
        angle = calculateAngle360(dist[0], dist[1]) - 180;

        this.state.rotateInverse = calculateRotationOriginMat4(
          -angle,
          this.state.startPoint
        );
        break;
    }

    return <div>{this.makeCenterPoint(result)}</div>;
  }
}
