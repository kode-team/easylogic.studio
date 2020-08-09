import { EVENT } from "../../../util/UIElement";
import { Length } from "../../../editor/unit/Length";
import { LOAD, CHANGE } from "../../../util/Event";
import CubicBezierEditor from "../property-editor/CubicBezierEditor";
import RangeEditor from "../property-editor/RangeEditor";
import IterationCountEditor from "../property-editor/IterationCountEditor";
import SelectEditor from "../property-editor/SelectEditor";
import BasePopup from "./BasePopup";

export default class AnimationPropertyPopup extends BasePopup {

  getTitle() {
    return this.$i18n('animation.property.popup.title')
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
      changeEvent: '', 
      instance: {}, 
      data: {} 
    };
  }

  updateData(opt) {
    this.state.data = {...this.state.data, ...opt} 
    if (this.state.instance) {
      this.state.instance.trigger(this.state.changeEvent, this.state.data);
    }
  }

  getBody() {
    return /*html*/`<div class='animation-property-popup' ref='$popup'></div>`;
  }

  [LOAD('$popup')] () {
    return /*html*/`
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
    return /*html*/`
    <div class='timing-function'>
      <label>${this.$i18n('animation.property.popup.timing.function')}</label>
      <CubicBezierEditor ref='$cubicBezierEditor' key="timingFunction" value="${this.state.data.timingFunction}" onChange='changeCubicBezier' />
    </div>
    `
  }

  templateForKeyframe() {
   
    return /*html*/`
      <div class='name'>
        <label>${this.$i18n('animation.property.popup.keyframe')}</label>
        <div class='input grid-1'>
          <select ref='$name'></select>
        </div>
      </div>
    `
  }

  [LOAD('$name')] () {
    var current = this.$selection.currentProject;
    var names = []
    if (current && current.keyframes) {
      names = current.keyframes.map(it => {
        return {key: it.name, value: it.name}
      });
    }

    names.unshift({key: 'Select a keyframe', value : ''});

    return names.map(it => {
      var selected = it.value === this.name ? 'selected' : '';
      var label = this.$i18n(it.key);
      return `<option value='${it.value}' ${selected}>${label}</option>`
    })
  }

  [CHANGE('$name')] () {
    this.updateData({name: this.refs.$name.value })
  }

  templateForDirection() {

    var options = 'normal,reverse,alternate,alternate-reverse'.split(',').map(it => {
      return `${it}:${this.$i18n(it)}`
    }).join(',')

    return /*html*/`
      <div class='direction'>
        <SelectEditor 
            label='${this.$i18n('animation.property.popup.direction')}'
            ref='$direction' 
            key='direction' 
            value="${this.state.data.direction}"
            options='${options}'
            onChange='changeSelect'
        /> 
      </div>
    `
  }

  [EVENT('changeSelect')] (key, value) {
    this.updateData({ [key]: value })
  }

  templateForPlayState() {
    return /*html*/`
    <div class='play-state'>
      <SelectEditor 
          label='${this.$i18n('animation.property.popup.play.state')}'
          ref='$playState' 
          key='playState' 
          value="${this.state.data.playState}"
          options='${['paused', 'running']}'
          onChange='changeSelect'
      /> 
    </div>
  `
  }  

  templateForFillMode() {

    var options = 'none,forwards,backwards,both'.split(',').map(it=>{
      return `${it}:${this.$i18n(it)}`
    }).join(',');

    return /*html*/`
    <div class='fill-mode'>
      <SelectEditor 
          label='${this.$i18n('animation.property.popup.fill.mode')}'
          ref='$fillMode' 
          key='fillMode' 
          value="${this.state.data.fillMode}"
          options='${options}'
          onChange='changeSelect'
      /> 
    </div>
  `
  }

  templateForDelay () {
    return /*html*/`
    <div class='delay'>
      <RangeEditor 
        ref='$delay' 
        label='${this.$i18n('animation.property.popup.delay')}' 
        calc='false' 
        key='delay' 
        value='${this.state.data.delay}' 
        units='s,ms' 
        onChange="changeRangeEditor" />
    </div>
    `
  }

  templateForDuration () {
    return /*html*/`
    <div class='duration'>
      <RangeEditor 
        ref='$duration' 
        label='${this.$i18n('animation.property.popup.duration')}'  
        key='duration' 
        value='${this.state.data.duration}' 
        units='s,ms' 
        onChange="changeRangeEditor" />
    </div>
    `
  }

  templateForIterationCount () {
    return /*html*/`
      <div class='iteration-count'>
        <IterationCountEditor 
          ref='$iterationCount' 
          label='${this.$i18n('animation.property.popup.iteration')}' 
          key='iterationCount' 
          value='${this.state.iterationCount || '0'}' 
          units='normal,infinite' 
          onChange="changeRangeEditor" 
        />
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

    this.children.$cubicBezierEditor.trigger('showCubicBezierEditor', data.data.timingFunction)        
  }

  [EVENT("hideAnimationPropertyPopup")]() {
    this.$el.hide();
  }
}
