import BaseProperty from "./BaseProperty";
import {
  LOAD, CLICK, DEBOUNCE,
} from "@core/Event";

import { EVENT } from "@core/UIElement";
import icon from "@icon/icon";
import { pattern_list } from "@util/Resource";
import { registElement } from "@core/registerElement";


export default class PatternProperty extends BaseProperty {

  getTitle () {
    return this.$i18n('pattern.property.title');
  }


  hasKeyframe () {
    return true; 
  }

  getKeyframeProperty () {
    return 'pattern';
  }


  getTitleClassName() {
    return 'pattern'
  }

  getBody() {
    return `<div class='full pattern-property' ref='$body'></div>`;
  }

  getTools() {
    return /*html*/`
      <select ref="$patternSelect">      
      </select>
      <button type="button" ref="$add" title="add Pattern">${icon.add}</button>
    `
  }
  

  [CLICK("$add")]() {
    var patternType = this.refs.$patternSelect.value;

    this.children.$patternEditor.trigger('add', patternType)
  }

  [LOAD('$patternSelect')] () {
    var list = pattern_list.map(it => { 
      return {title: this.$i18n(`pattern.property.${it}`), value: it}
    })

    const totalList = [
      ...list
    ]

    return totalList.map(it => {
      var {title, value} = it;
      
      return `<option value='${value}'>${title}</option>`
    })
  }

  [LOAD('$body')] () {
    var current = this.$selection.current || {} 
    var value = current.pattern;

    return /*html*/`<object refClass="PatternEditor" ref='$patternEditor' value='${value}' hide-label='true' onchange='changePatternEditor' />`
  }

  [EVENT('changePatternEditor')] (key, pattern) {

    this.command('setAttribute', 'change pattern', { 
      pattern 
    })
  }

  [EVENT('refreshSelection')] () {
    this.refreshShow(['artboard', 'rect', 'circle', 'text', 'cube', 'cylinder']);
  }

  [EVENT('refreshSVGArea') + DEBOUNCE(1000)] () {
    this.load('$patternSelect');
  }
}

registElement({ PatternProperty })