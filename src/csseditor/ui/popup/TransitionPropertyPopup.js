import { EVENT } from "../../../util/UIElement";
import { Length } from "../../../editor/unit/Length";
import { LOAD} from "../../../util/Event";
import CubicBezierEditor from "../property-editor/CubicBezierEditor";
import RangeEditor from "../property-editor/RangeEditor";
import SelectEditor from "../property-editor/SelectEditor";
import BasePopup from "./BasePopup";

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



export default class TransitionPropertyPopup extends BasePopup {

  getTitle() {
    return 'Transition'
  }

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
    this.setState(opt, false); 
    this.emit("changeTransitionPropertyPopup", opt);
  }

  getBody() {
    return `<div class='transition-property-popup' ref='$popup'></div>`;
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
   
    return `
      <div class='name'>
        <SelectEditor ref='$property' icon="true" label="Property" key='property' value="${this.state.property}" options="${property_list.join(',')}" onChange='changeTransition' /> 
      </div>
    `
  }
  

  templateForDelay () {
    return `
    <div class='delay'>
      <RangeEditor ref='$delay' label='Delay' calc='false' key='delay' value='${this.state.delay}' units='s,ms' onChange="changeRangeEditor" />
    </div>
    `
  }

  templateForDuration () {
    return `
    <div class='duration'>
      <RangeEditor ref='$duration' label='Duration'  calc='false' key='duration' value='${this.state.duration}' units='s,ms' onChange="changeRangeEditor" />
    </div>
    `
  }

  [EVENT('changeRangeEditor')] (key, value) {
    this.updateData({ [key]: value })
  }

  [EVENT('changeCubicBezier')] (key, value) {
    this.updateData({ [key]: value })
  }

  [EVENT("showTransitionPropertyPopup")](data) {
    this.setState(data);
    this.refresh();

    this.show(250)

    this.emit('showCubicBezierEditor', data)    
  }

  [EVENT("hideTransitionPropertyPopup")]() {
    this.$el.hide();
  }
}
