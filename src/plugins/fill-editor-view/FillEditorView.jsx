import { DOMDIFF, KEYUP, LOAD, POINTERMOVE, POINTEROUT, POINTERSTART, SUBSCRIBE } from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import "./FillEditorView.scss";
import { GradientType } from "el/editor/types/model";
import { mat4, vec3 } from "gl-matrix";
import { calculateAngle360, calculateRotationOriginMat4, vertiesMap } from "el/utils/math";
import { END, MOVE } from "el/editor/types/event";
import { Length } from "el/editor/unit/Length";

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

 class FillColorstepEditor extends FillBaseEditor {
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
    const image = this.state.image;
    image.removeColorStepByIndex(currentIndex);

    this.updateColorStepStatus(image, -1);
  }

  sortToRight() {
    const image = this.state.image;
    image.sortToRight();

    this.updateColorStepStatus(image, -1);
  }

  sortToLeft() {
    const image = this.state.image;
    image.sortToLeft();

    this.updateColorStepStatus(image, -1);
  }

  appendColorStep(currentIndex) {
    const nextIndex = currentIndex + 1;
    const image = this.state.image;

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
    const image = this.state.image;
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

  [POINTERSTART("$el .point") + MOVE('movePoint') + END('moveEndPoint')](e) {
    this.$el.toggleClass("dragging", true);
    this.initializeData();

    const result = this.state.imageResult;

    this.pointTarget = e.$dt.data('type');
    this.startPoint = this.$viewport.applyVertex(result.startPoint);
    this.endPoint = this.$viewport.applyVertex(result.endPoint);

  }

  movePoint (dx, dy) {
    const targetPoint = this.pointTarget === 'start' ? this.startPoint : this.endPoint;
    const nextPoint = vec3.add([], targetPoint, [dx, dy, 0]);

    const [worldPosition] = vertiesMap([
      this.$viewport.applyVertexInverse(nextPoint)
    ],  
      this.state.currentMatrix.absoluteMatrixInverse
    );

    const width = this.state.currentMatrix.width;
    const height = this.state.currentMatrix.height;


    let newX, newY;
    if (this.pointTarget === 'start') {
      newX = this.state.imageResult.image.x1.isPercent() ? Length.percent(worldPosition[0] / width * 100) : Length.px(worldPosition[0]);
      newY = this.state.imageResult.image.y1.isPercent() ? Length.percent(worldPosition[1] / height * 100) : Length.px(worldPosition[1]);
   
      this.state.imageResult.image.reset({
        x1: newX,
        y1: newY
      })

    } else if (this.pointTarget === 'end') {
      newX = this.state.imageResult.image.x2.isPercent() ? Length.percent(worldPosition[0] / width * 100) : Length.px(worldPosition[0]);
      newY = this.state.imageResult.image.y2.isPercent() ? Length.percent(worldPosition[1] / height * 100) : Length.px(worldPosition[1]);
  
      this.state.imageResult.image.reset({
        x2: newX,
        y2: newY
      })
    }

    this.command(
      "setAttributeForMulti",
      `change ${this.state.key} fragment`,
      this.$selection.packByValue({
        [this.state.key] : `${this.state.imageResult.image}`,
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
      case GradientType.LINEAR:
        this.startPoint = this.$viewport.applyVertex(result.startPoint);
        this.endPoint = this.$viewport.applyVertex(result.endPoint);

        // conic 의 경우 중간 지점에 따라 UI 크기가 달라지기 때문에 
        // 마지막 UI 에서 x, y 를 가지고 오도록 한다. 
        const x = +$colorstep.data('x');
        const y = +$colorstep.data('y');
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
        [this.state.key] : `${nextImage}`,
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
      image.colorsteps[this.$targetIndex].toggle();

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
        [this.state.key]: `${image}`
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
      case GradientType.REPEATING_LINEAR:

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
        this.state.hoverColorStep =
          image.pickColorStep(
            newDist
          );
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
          'fill',
          'stroke'
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
  }

  [SUBSCRIBE("hideFillEditorView")]() {
    this.setState({
      key: "",
      isShow: false,
      onchange: null,
    });
    this.$el.hide();
  }

  makeLinearCenterPoint(result) {
    let startPoint, endPoint, areaStartPoint, areaEndPoint, colorsteps;

    startPoint = this.$viewport.applyVertex(result.startPoint);
    endPoint = this.$viewport.applyVertex(result.endPoint);
    areaStartPoint = this.$viewport.applyVertex(result.areaStartPoint);
    areaEndPoint = this.$viewport.applyVertex(result.areaEndPoint);

    // angle 새로 구하기
    const dist = vec3.subtract([], endPoint, startPoint);
    const angle = calculateAngle360(dist[0], dist[1]) - 180;

    const rotateInverse = calculateRotationOriginMat4(
      -angle,
      startPoint
    );    

    const rotateInverseInverse = mat4.invert([], rotateInverse);

    colorsteps = result.colorsteps.map((it) => {
      it.screenXY = this.$viewport.applyVertex(it.pos);

      const [newScreenXY] = vertiesMap([it.screenXY], rotateInverse );

      it.stickScreenXY = vertiesMap([
        [newScreenXY[0] - 7, newScreenXY[1] - 21, 0]
      ], rotateInverseInverse)[0];



      return it;
    });



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
      <svg class="linear-gradient">
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
                x={it.stickScreenXY[0]}
                y={it.stickScreenXY[1]}
                transform={`rotate(${angle} ${it.stickScreenXY[0]} ${it.stickScreenXY[1]})`}
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
                x={it.stickScreenXY[0]}
                y={it.stickScreenXY[1]}
                transform={`rotate(${angle} ${it.stickScreenXY[0]} ${it.stickScreenXY[1]})`}
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

        <circle class="point" data-type="start" cx={startPoint[0]} cy={startPoint[1]}></circle>
        <circle class="point" data-type="end" cx={endPoint[0]} cy={endPoint[1]}></circle>        
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

    switch(image.type) {
    case GradientType.LINEAR:
      this.state.startPoint = this.$viewport.applyVertex(result.startPoint);
      this.state.endPoint = this.$viewport.applyVertex(result.endPoint);

      const dist = vec3.subtract([], this.state.endPoint, this.state.startPoint);
      const angle = calculateAngle360(dist[0], dist[1]) - 180;

      this.state.rotateInverse = calculateRotationOriginMat4(
        -angle,
        this.state.startPoint
      );
      break;
    }

    return <div>{this.makeCenterPoint(result)}</div>;
  }
}
