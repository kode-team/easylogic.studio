import UIElement, { EVENT } from "../../../util/UIElement";
import { CHANGE_EDITOR, CHANGE_SELECTION } from "../../types/event";
import { editor } from "../../../editor/editor";
import { ColorStep } from "../../../editor/image-resource/ColorStep";
import {
  LOAD,
  POINTERSTART,
  MOVE,
  END,
  INPUT,
  CHANGE,
  CLICK,
  SHIFT,
  PREVENT
} from "../../../util/Event";
import {
  EMPTY_STRING
} from "../../../util/css/types";
import { LinearGradient } from "../../../editor/image-resource/LinearGradient";
import { Length, Position } from "../../../editor/unit/Length";
import PredefinedLinearGradientAngle from "./shape/PredefinedLinearGradientAngle";
import GradientAngle from "./shape/GradientAngle";
import PredefinedRadialGradientPosition from "./shape/PredefinedRadialGradientPosition";
import GradientPosition from "./shape/GradientPosition";

const staticGradientString = "static-gradient";
/**
 * Gradient Editor 를 구현한다.
 * Gradient Editor 는 외부의 어떠한 데이타와도 연결 되지 않는다.
 *
 * 초기 셋팅된 colorsteps 을 가지고 변경한 이후
 * 변경되 데이타만 이벤트로 전달한다.
 *
 * 순수한 UI Component 가 된다
 */
export default class VerticalColorStep extends UIElement {
  initialize() {
    super.initialize();

    this.colorsteps = [
      new ColorStep({ color: "yellow", percent: 0, index: 0 }),
      new ColorStep({ color: "red", percent: 100, index: 100 })
    ];
  }

  components() {
    return {
      GradientAngle,
      PredefinedLinearGradientAngle,
      PredefinedRadialGradientPosition,
      GradientPosition
    };
  }

  template() {
    return `
            <div class='vertical-colorstep-container'>
                <div class='vertical-colorstep' ref="$verticalColorstep">
                    <div class='gradient-steps'>
                        <div class="hue-container" ref="$back"></div>            
                        <div class="hue" ref="$steps">
                            <div class='step-list' ref="$stepList"></div>
                        </div>
                    </div>
                </div>
                <div class='gradient-tools'>
                    <button type="button" class='guide-button' ref="$cutOff"></button>
                    <button type="button" class='guide-button cut' ref="$cutOn"></button>
                    <span ref="$radialGradientTool">
                      <button type="button" class="radial-gradient-shape circle" data-value='circle' ref='$circle'></button>
                      <button type="button" class="radial-gradient-shape ellipse" data-value='ellipse' ref='$ellipse'></button>
                      <select ref="$selectRadialExtent">
                        <option value="">none</option>
                        <option value="closest-side">closest-side</option>
                        <option value="closest-corner">closest-corner	</option>
                        <option value="farthest-side">farthest-side	</option>
                        <option value="farthest-corner">farthest-corner	</option>
                      </select>
                    </span>
                </div>           
                <div class='gradient-editor'>
                  <div class='angle-editor' ref='$angleEditor'>
                    <PredefinedLinearGradientAngle />     
                    <GradientAngle />
                  </div>
                  <div class='position-editor' ref='$positionEditor'>
                    <PredefinedRadialGradientPosition />
                    <GradientPosition />
                  </div>
                </div>              
            </div>
        `;
  }

  setColorSteps(colorsteps = []) {
    this.colorsteps = colorsteps;
  }

  refresh() {
    this.refs.$verticalColorstep.px("width", editor.config.get("step.width"));
    this.setColorUI();
  }

  [EVENT(CHANGE_EDITOR, CHANGE_SELECTION)]() {
    this.refresh();
  }

  updateRadialShape(radialType) {
    const [shape, extent] = radialType.split(" ");
    if (shape === "circle") {
      this.refs.$circle.addClass("selected");
      this.refs.$ellipse.removeClass("selected");
    } else {
      this.refs.$circle.removeClass("selected");
      this.refs.$ellipse.addClass("selected");
    }
    this.refs.$selectRadialExtent.val(extent);
  }

  /**
   * Gradient 에디터를 보여주자.
   * 옵션으로 { colorsteps } 을 넣을 수 있다.
   *
   * @param {object} opt
   */
  [EVENT("showGradientEditor")](opt, isUpdate) {
    this.$el.show();

    // static 에서 다른 gradient 로 넘어갈 때
    // colorsteps 이 최소 2개가 되어야 하기에  (이것 조차도 예외가 발생 할 수 있지만 )
    // 일단 기존의 gradientType 이 static 인데 다른걸로 바뀌는거랑
    // static 이 아닌데 static 의 바뀌는건 예외 처리를 해야할 듯 하다.
    // 예르 들어서 아래와 같이 처리할 수도 있다.

    if (
      this.gradientType === staticGradientString &&
      opt.type !== staticGradientString
    ) {
      // 이전이 static 이고 이후가 static 아닐 때
      this.setColorSteps([
        new ColorStep({
          color: "yellow",
          percent: 0,
          index: 0,
          selected: true
        }),
        new ColorStep({ color: "red", percent: 100, index: 1 })
      ]);
    } else if (
      this.gradientType !== staticGradientString &&
      opt.type == staticGradientString
    ) {
      // 이전이 static 이 아니고 이후가 static 일 때는
      this.setColorSteps([
        new ColorStep({ color: "red", percent: 0, index: 0, selected: true })
      ]);
    }

    if (!this.colorsteps && opt.colorsteps) {
      // 여기는 나머지 조건에 들지 않지만 초기 colorsteps 가 있는 경우
      // 최초 이미지를 선택 했을 때를 위한 조건
      this.setColorSteps(opt.colorsteps);
    }

    if (opt.refresh) {
      this.setColorSteps(opt.colorsteps);
      this.refresh();
    }

    // 여기는 들어온 colorsteps 중에 최소 한개는 선택 해야하는 과정
    // 흠 코드를 좀 아름답게 짜고 싶다.
    // 반복 패턴을 어떻게 하면 filter 같은걸 안쓰고 한번에 처리 할 수 있을까?
    ColorStep.select(this.colorsteps, opt.selectColorStepId);
    this.currentColorStep = this.colorsteps.filter(step => step.selected)[0];
    this.emit("selectColorStep", this.currentColorStep.color);

    this.gradientType = opt.type;
    if (typeof opt.angle !== "undefined") {
      this.angle = opt.angle;
    }

    if (typeof opt.radialPosition !== "undefined") {
      this.radialPosition = opt.radialPosition;
    }

    switch (this.gradientType) {
      case "linear":
      case "linear-gradient":
      case "repeating-linear":
      case "repeating-linear-gradient":
        this.$el.show();
        this.refs.$angleEditor.show("inline-block");
        this.refs.$positionEditor.hide();
        this.refs.$radialGradientTool.hide();
        this.emit("showGradientAngle", this.angle);

        break;
      case "radial":
      case "radial-gradient":
      case "repeating-radial":
      case "repeating-radial-gradient":
        this.$el.show();
        this.refs.$angleEditor.hide();
        this.refs.$positionEditor.show("inline-block");
        this.updateRadialShape(opt.radialType || "ellipse");
        this.refs.$radialGradientTool.show("inline-block");
        this.emit(
          "showGradientPosition",
          opt.radialPosition || this.radialPosition || Position.CENTER
        );

        break;
      case "conic":
      case "conic-gradient":
      case "repeating-conic":
      case "repeating-conic-gradient":
        this.$el.show();
        this.refs.$angleEditor.show("inline-block");
        this.refs.$positionEditor.show("inline-block");
        this.refs.$radialGradientTool.hide();
        this.emit("showGradientAngle", this.angle);
        this.emit(
          "showGradientPosition",
          opt.radialPosition || this.radialPosition || Position.CENTER
        );
        break;
      default:
        this.$el.hide();
        this.refs.$angleEditor.hide();
        this.refs.$positionEditor.hide();
        this.refs.$radialGradientTool.hide();
        break;
    }

    this.refresh();

    if (isUpdate) {
      this.updateColorStep();
    }
  }

  [EVENT("selectFillPickerTab")](type) {
    this.updateColorStep();
  }

  [EVENT("hideGradientEditor", CHANGE_EDITOR, CHANGE_SELECTION)]() {
    this.$el.hide();
  }

  getStepPosition(step) {
    var { min, max } = this.getMinMax();

    var left = this.refs.$steps.offset().left;

    min -= left;
    max -= left;

    if (step.isPx) {
      return step.px;
    }

    return min + (max - min) * (step.percent / 100);
  }

  getUnitName(step) {
    var unit = step.unit || '%';

    if (['px', 'em'].includes(unit)) {
      return unit;
    }

    return '%';
  }

  getUnitSelect(step) {
    return `
    <select class='unit' data-colorstep-id="${step.id}">
        <option value='percent' ${
          step.isPercent ? "selected" : EMPTY_STRING
        }>%</option>
        <option value='px' ${step.isPx ? "selected" : EMPTY_STRING}>px</option>
        <option value='em' ${step.isEm ? "selected" : EMPTY_STRING}>em</option>
    </select>
    `;
  }

  getMaxValue() {
    return editor.config.get("step.width") || 400;
  }

  // load 후에 이벤트를 재설정 해야한다.
  [LOAD("$stepList")]() {
    return this.colorsteps.map((step, index) => {
      var cut = step.cut ? "cut" : EMPTY_STRING;
      var unitValue = step.getUnitValue(this.getMaxValue());

      return `
            <div 
                class='drag-bar ${step.selected ? "selected" : EMPTY_STRING}' 
                id="${step.id}"
                style="left: ${this.getStepPosition(step)}px;"
            >   
                <div 
                    class="guide-step step" 
                    data-index="${index}" 
                    style=" border-color: ${step.color};background-color: ${
        step.color
      };"
                ></div>
                <div class='guide-line' 
                    style="background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0) 10%, ${
                      step.color
                    } 100%) ;"></div>
                <div class="guide-change ${cut}" data-index="${index}"></div>
                <div class="guide-unit ${step.getUnit()}">
                    <input type="number" class="percent" min="-100" max="100" step="0.1"  value="${
                      unitValue.percent
                    }" data-index="${index}"  />
                    <input type="number" class="px" min="-100" max="1000" step="1"  value="${
                      unitValue.px
                    }" data-index="${index}"  />
                    <input type="number" class="em" min="-100" max="500" step="0.1"  value="${
                      unitValue.em
                    }" data-index="${index}"  />
                    ${this.getUnitSelect(step)}
                </div>       
            </div>
        `;
    });
  }

  refresh() {
    this.load();
    this.setColorUI();
  }

  setColorUI() {
    var test = [...this.colorsteps];
    ColorStep.sort(test);

    this.refs.$stepList.css(
      "background-image",
      LinearGradient.toLinearGradient(test)
    );
  }

  /* slide 영역 min,max 구하기  */
  getMinMax() {
    var min = this.refs.$steps.offsetLeft();
    var width = this.refs.$steps.width();
    var max = min + width;

    return { min, max, width };
  }

  /* 현재 위치 구하기  */

  getCurrent() {
    var { min, max } = this.getMinMax();
    var { x } = editor.config.get("pos");

    var current = Math.min(Math.max(min, x), max);

    return current;
  }

  /**
   * 마우스 이벤트로 현재 위치 및 percent 설정, 전체  gradient 리프레쉬
   *
   * @param {*} e
   */
  refreshColorUI(isUpdate) {
    var { min, max } = this.getMinMax();

    var current = this.getCurrent();

    if (this.currentStep) {
      var posX = Math.max(min, current);
      var px = posX - this.refs.$steps.offsetLeft();

      if (editor.config.get("bodyEvent").ctrlKey) {
        px = Math.floor(px); // control + drag is floor number
      }
      this.currentStepBox.px("left", px);

      var maxValue = max - min;
      var percent = Length.px(px).toPercent(maxValue).value;
      var em = Length.px(px).toEm(maxValue).value;

      this.currentColorStep.reset({ px, percent, em });

      this.currentUnitPercent.val(percent);
      this.currentUnitPx.val(px);
      this.currentUnitEm.val(em);

      this.updateColorStep();
      this.setColorUI();
    }
  }

  // 이미 선언된 메소드를 사용하여 메타 데이타로 쓴다.
  [CLICK("$back")](e) {
    this.addStep(e);
  }

  removeStep(e) {
    var id = e.$delegateTarget.attr("id");
    this.colorsteps = this.colorsteps.filter(step => step.id != id);
    this.refresh();
    this.updateColorStep();
  }

  addStep(e) {
    var { min, max } = this.getMinMax();
    var current = this.getCurrent(e);
    var percent = Math.floor(((current - min) / (max - min)) * 100);

    ColorStep.createByPercent(this.colorsteps, percent);
    this.refresh();
    this.updateColorStep();
  }

  getSortedStepList() {
    var list = this.refs.$stepList.$$(".drag-bar").map(it => {
      return { id: it.attr("id"), x: it.cssFloat("left") };
    });

    list.sort((a, b) => {
      if (a.x == b.x) return 0;
      return a.x > b.x ? 1 : -1;
    });

    return list.map(it => it.id);
  }

  selectStep(e) {
    var parent = e.$delegateTarget.parent();
    this.currentStepBox = this.currentStepBox || parent;
    var $selected = this.refs.$stepList.$(".selected");
    if ($selected && !$selected.is(this.currentStepBox)) {
      $selected.removeClass("selected");
    }

    this.colorsteps.forEach(step => {
      step.selected = step.id === this.currentColorStep.id;
    });

    this.currentStepBox.addClass("selected");
    this.setColorUI();

    this.emit("selectColorStep", this.currentColorStep.color);
  }

  getRadialType() {
    var shape = this.refs.$circle.hasClass("selected") ? "circle" : "ellipse";
    var extent = this.refs.$selectRadialExtent.value;

    return `${shape} ${extent}`;
  }

  updateColorStep(opt = {}) {
    const colorsteps = [...this.colorsteps];

    // ui 랑 속성이 달라서 정렬된 데이타를  넘겨준다.
    // 자, 여기서 질문 하나
    // color step 을 하나 드래그 해서 다른 스텝으로 넘어가는 경우
    // 데이타 순서를 어떻게 바꿔야 좋을까요?
    ColorStep.sort(colorsteps);

    this.emit("changeColorStep", {
      colorsteps,
      angle: this.angle,
      radialPosition: this.radialPosition,
      radialType: this.getRadialType(),
      ...opt
    });
  }

  [CLICK("$steps .step") + SHIFT](e) {
    this.removeStep(e);
  }

  [CLICK("$steps .step")](e) {
    this.selectStep(e);
  }

  [CLICK("$cutOff")](e) {
    this.colorsteps.forEach(step => {
      step.cut = false;
    });
    this.setColorUI();
    this.updateColorStep();
  }

  [CLICK("$cutOn")](e) {
    this.colorsteps.forEach(step => {
      step.cut = true;
    });
    this.setColorUI();
    this.updateColorStep();
  }

  [CLICK("$steps .guide-change")](e) {
    var index = +e.$delegateTarget.attr("data-index");

    var step = this.colorsteps[index];

    if (step) {
      step.reset({ cut: !step.cut });
      e.$delegateTarget.toggleClass("cut", step.cut);
      this.setColorUI();

      this.updateColorStep();
    }
  }

  [CHANGE("$steps .guide-unit select.unit")](e) {
    var unit = e.$delegateTarget.val();
    var id = e.$delegateTarget.attr("data-colorstep-id");

    var step = editor.get(id);

    if (step) {
      step.changeUnit(unit, this.getMaxValue());
      editor.send(CHANGE_COLORSTEP, step);

      var $parent = e.$delegateTarget.parent();
      $parent
        .removeClass('%', 'px', 'em')
        .addClass(step.getUnit());
    }
  }

  [INPUT("$steps input.percent")](e) {
    var value = +e.$delegateTarget.val();
    var index = +e.$delegateTarget.attr("data-index");

    var step = this.colorsteps[index];

    if (step) {
      step.changeUnit("percent", value, this.getMaxValue());

      this.currentStepBox.px("left", step.px);
      this.currentUnitPx.val(step.px);
      this.currentUnitEm.val(step.em);

      this.updateColorStep();
      this.setColorUI();
    }
  }

  [INPUT("$steps input.px")](e) {
    var value = +e.$delegateTarget.val();
    var index = +e.$delegateTarget.attr("data-index");

    var step = this.colorsteps[index];

    if (step) {
      step.changeUnit("px", value, this.getMaxValue());

      this.currentStepBox.px("left", step.px);
      this.currentUnitPercent.val(step.percent);
      this.currentUnitEm.val(step.em);

      this.updateColorStep();
      this.setColorUI();
    }
  }

  [INPUT("$steps input.em")](e) {
    var value = +e.$delegateTarget.val();
    var index = +e.$delegateTarget.attr("data-index");

    var step = this.colorsteps[index];

    if (step) {
      step.changeUnit("em", value, this.getMaxValue());

      this.currentStepBox.px("left", step.px);
      this.currentUnitPercent.val(step.percent);
      this.currentUnitPx.val(step.px);

      this.updateColorStep();
      this.setColorUI();
    }
  }

  // Event Bindings
  end() {
    if (this.refs.$stepList) {
      this.refs.$stepList.removeClass("mode-drag");
    }
  }

  move() {
    this.refreshColorUI(true);
    this.refs.$stepList.addClass("mode-drag");
  }

  [POINTERSTART("$steps .step") + PREVENT + MOVE() + END()](e) {
    this.xy = e.xy;
    this.currentStep = e.$delegateTarget;
    this.currentColorStep = this.colorsteps[
      +this.currentStep.attr("data-index")
    ];
    this.currentStepBox = this.currentStep.parent();
    this.currentUnit = this.currentStepBox.$(".guide-unit");
    this.currentUnitPercent = this.currentUnit.$(".percent");
    this.currentUnitPx = this.currentUnit.$(".px");
    this.currentUnitEm = this.currentUnit.$(".em");

    if (this.currentStep) {
      this.selectStep(e);
    }
  }

  [EVENT("changeColorPicker")](color) {
    if (this.currentColorStep) {
      this.currentColorStep.reset({ color });
      this.refresh();
      this.updateColorStep();
    }
  }

  [EVENT("changeGradientAngle")](angle) {
    this.angle = angle;
    this.updateColorStep();
  }

  [EVENT("changeGradientPosition")](radialPosition) {
    this.radialPosition = radialPosition;
    this.updateColorStep();
  }

  [CLICK("$circle")](e) {
    this.refs.$circle.addClass("selected");
    this.refs.$ellipse.removeClass("selected");
    this.updateColorStep();
  }

  [CLICK("$ellipse")](e) {
    this.refs.$circle.removeClass("selected");
    this.refs.$ellipse.addClass("selected");
    this.updateColorStep();
  }

  [CHANGE("$selectRadialExtent")](e) {
    this.updateColorStep();
  }
}
