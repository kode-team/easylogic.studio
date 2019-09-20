import { EVENT } from "../../../util/UIElement";
import { Length } from "../../../editor/unit/Length";
import { LOAD, CHANGE } from "../../../util/Event";
import CubicBezierEditor from "../property-editor/CubicBezierEditor";
import { editor } from "../../../editor/editor";
import RangeEditor from "../property-editor/RangeEditor";
import IterationCountEditor from "../property-editor/IterationCountEditor";
import SelectEditor from "../property-editor/SelectEditor";
import BasePopup from "./BasePopup";


export default class AnimationPropertyPopup extends BasePopup {

  getTitle() {
    return 'Animation'
  }

  components() {
    return {
      SelectEditor,
      CubicBezierEditor,
      RangeEditor,
      IterationCountEditor
    }
  }

  initState() {
    return {
      name: 'none',
      direction: 'normal',
      duration: Length.second(0),
      timingFunction: 'ease',
      delay: Length.second(0),
      iterationCount: 0,
      playState: 'running',
      fillMode: 'none'
    };
  }

  updateData(opt) {
    this.setState(opt, false); 
    this.emit("changeAnimationPropertyPopup", opt);
  }

  getBody() {
    return `<div class='animation-property-popup' ref='$popup'></div>`;
  }

  [LOAD('$popup')] () {
    return `
      <div class="box">
        ${this.templateForKeyframe()}
        ${this.templateForTimingFunction()}
        ${this.templateForIterationCount()}
        ${this.templateForDelay()}
        ${this.templateForDuration()}
        ${this.templateForDirection()}
        ${this.templateForFillMode()}
        ${this.templateForPlayState()}
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

  templateForKeyframe() {
   
    return `
      <div class='name'>
        <label>Keyframe</label>
        <div class='input grid-1'>
          <select ref='$name'></select>
        </div>
      </div>
    `
  }

  [LOAD('$name')] () {
    var current = editor.selection.currentProject;
    var names = []
    if (current && current.keyframes) {
      names = current.keyframes.map(it => {
        return {key: it.name, value: it.name}
      });
    }

    names.unshift({key: 'Select a keyframe', value : ''});

    return names.map(it => {
      var selected = it.value === this.name ? 'selected' : '';
      return `<option value='${it.value}' ${selected}>${it.key}</option>`
    })
  }

  [CHANGE('$name')] () {
    this.updateData({name: this.refs.$name.value })
  }

  templateForDirection() {
    return `
      <div class='direction'>
        <SelectEditor 
            label='Direction'
            ref='$direction' 
            key='direction' 
            value="${this.state.direction}"
            options='${['normal', 'reverse', 'alternate', 'alternate-reverse']}'
            onChange='changeSelect'
        /> 
      </div>
    `
  }

  [EVENT('changeSelect')] (key, value) {
    this.updateData({ [key]: value })
  }

  templateForPlayState() {
    return `
    <div class='play-state'>
      <SelectEditor 
          label='Play State'
          ref='$playState' 
          key='playState' 
          value="${this.state.playState}"
          options='${['paused', 'running']}'
          onChange='changeSelect'
      /> 
    </div>
  `
  }  

  templateForFillMode() {
    return `
    <div class='fill-mode'>
      <SelectEditor 
          label='Fill Mode'
          ref='$fillMode' 
          key='fillMode' 
          value="${this.state.fillMode}"
          options='${['none', 'forwards', 'backwards', 'both']}'
          onChange='changeSelect'
      /> 
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

  templateForIterationCount () {
    return `
      <div class='iteration-count'>
        <IterationCountEditor ref='$iterationCount' label='Iteration' calc='false' key='iterationCount' value='${this.state.iterationCount}' units='normal,infinite' onChange="changeRangeEditor" />
      </div>
    `
  }

  [EVENT('changeRangeEditor')] (key, value) {

    if (key === 'iterationCount') {
      if (value.unit === 'normal') {
        value = Length.number(value.value)
      } else {
        value = Length.string(value.unit)
      }
    }
    this.updateData({ [key]: value })
  }

  [EVENT('changeCubicBezier')] (key, value) {
    this.updateData({ [key]: value })
  }

  [EVENT("showAnimationPropertyPopup")](data) {
    this.setState(data);

    this.show(250)

    this.emit('showCubicBezierEditor', data)    
  }

  [EVENT("hideAnimationPropertyPopup")]() {
    this.$el.hide();
  }
}
