import UIElement, { EVENT } from "../../../../util/UIElement";
import { Length } from "../../../../editor/unit/Length";
import { CHANGE_SELECTION } from "../../../types/event";
import { LOAD} from "../../../../util/Event";
import CubicBezierEditor from "../panel/property-editor/CubicBezierEditor";
import { html } from "../../../../util/functions/func";
import RangeEditor from "../panel/property-editor/RangeEditor";
import SelectEditor from "../panel/property-editor/SelectEditor";

const property_list = [
  'none',
  'all',
  'background-color',
  'background-position',
  'background-size',
  'border',
  'border-color',
  'border-width',
  'border-bottom',
  'border-bottom-color',
  'border-bottom-left-radius',
  'border-bottom-right-radius',
  'border-bottom-width',
  'border-left',
  'border-left-color',
  'border-left-width',
  'border-radius', 
  'border-right',
  'border-right-color',
  'border-right-width',
  'border-spacing',
  'border-top',
  'border-top-color',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-top-width',
  'bottom',
  'box-shadow',
  'color',
  'filter',		

  'font-size',
  'font-size-adjust',
  'font-stretch',
  'font-weight',
  'height',
  'left',
  'letter-spacing',
  'line-height',
  'margin',
  'margin-bottom',
  'margin-left',
  'margin-right',
  'margin-top',
  'max-height',
  'max-width',
  'min-height',
  'min-width',
  'opacity',
  
  'outline',
  
  'padding',
  'padding-bottom',
  'padding-left',
  'padding-right',
  'padding-top',
  'perspective',
  'perspective-origin',
  'right',
  'text-decoration',
  'text-decoration-color',
  'text-indent',
  'text-shadow',
  'top',
  'transform',
  'vertical-align',
  'visibility',
  'width',
  'word-spacing',
  'z-index'
]



export default class TransitionPropertyPopup extends UIElement {

  components() {
    return {
      SelectEditor,
      CubicBezierEditor,
      RangeEditor
    }
  }

  initState() {
    return {
      property: 'all',
      duration: Length.second(0),
      timingFunction: 'ease',
      delay: Length.second(0)
    };
  }

  updateData(opt) {
    this.setState(opt, false); // 자동 로드를 하지 않음, state 만 업데이트
    this.emit("changeTransitionPropertyPopup", opt);
  }

  template() {
    return `<div class='popup transition-property-popup' ref='$popup'></div>`;
  }

  [LOAD('$popup')] () {
    return `
      <div class="box">
        ${this.templateForProperty()}
        ${this.templateForTimingFunction()}
        ${this.templateForDelay()}
        ${this.templateForDuration()}
      </div>
    `;
  }

  templateForTimingFunction () {
    return `
    <div class='timing-function'>
      <label>Timing function</label>
      <CubicBezierEditor ref='$cubicBezierEditor' key="timingFunction" value="${this.state.timingFunction}" onChange='changeCubicBezier' />
    </div>
    `
  }

  [EVENT('changeTransition')] (key, value) {
    this.updateData({
      [key]: value
    })
  }

  templateForProperty() {
   
    return html`
      <div class='name'>
        <SelectEditor ref='$property' label="Property" key='property' value="${this.state.property}" options="${property_list.join(',')}" onChange='changeTransition' /> 
      </div>
    `
  }
  

  templateForDelay () {
    return `
    <div class='delay grid-1'>
      <label>Delay</label>
      <RangeEditor ref='$delay' calc='false' key='delay' value='${this.state.delay}' units='s,ms' onChange="changeRangeEditor" />
    </div>
    `
  }

  templateForDuration () {
    return `
    <div class='duration grid-1'>
      <label>Duration</label>
      <RangeEditor ref='$duration'  calc='false' key='duration' value='${this.state.duration}' units='s,ms' onChange="changeRangeEditor" />
    </div>
    `
  }

  // 개별 속성을 변경할 때  state 로 저장 하기 

  [EVENT('changeRangeEditor')] (key, value) {
    this.updateData({ [key]: value })
  }

  [EVENT('changeCubicBezier')] (key, value) {
    this.updateData({ [key]: value })
  }

  [EVENT("showTransitionPropertyPopup")](data) {
    this.setState(data);
    this.refresh();

    this.$el
      .css({
        top: Length.px(150),
        right: Length.px(320),
        bottom: Length.auto
      })
      .show("inline-block");

    this.emit("hidePropertyPopup");

    // 화면에 보이고 난 후에 업데이트 할까? 
    this.emit('showCubicBezierEditor', data)    
  }

  [EVENT(
    "hideTransitionPropertyPopup",
    "hidePropertyPopup",
    CHANGE_SELECTION
  )]() {
    this.$el.hide();
  }
}
