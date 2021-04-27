import BaseProperty from "./BaseProperty";
import {
  LOAD, CLICK, DEBOUNCE, SUBSCRIBE,
} from "el/base/Event";


import icon from "el/editor/icon/icon";
import { pattern_list } from "el/editor/util/Resource";
import { registElement } from "el/base/registElement";


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

  [SUBSCRIBE('changePatternEditor')] (key, pattern) {

    this.command('setAttribute', 'change pattern', { 
      pattern 
    })
  }

  [SUBSCRIBE('refreshSelection')] () {
    this.refreshShow(['artboard', 'rect', 'circle', 'text', 'cube', 'cylinder']);
  }

  [SUBSCRIBE('refreshSVGArea') + DEBOUNCE(1000)] () {
    this.load('$patternSelect');
  }
}

registElement({ PatternProperty })