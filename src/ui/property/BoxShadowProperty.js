import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE, CLICK } from "@sapa/Event";
import { EVENT } from "@sapa/UIElement";
import icon from "@icon/icon";
import { registElement } from "@sapa/registerElement";


export default class BoxShadowProperty extends BaseProperty {

  getTitle () {
    return this.$i18n('boxshadow.property.title');
  }

  getBody() {
    return /*html*/`
      <div class="full box-shadow-item" ref="$shadowList"></div>
    `;
  }

  hasKeyframe() {
    return true; 
  }

  getKeyframeProperty () {
    return 'box-shadow'
  }


  [LOAD("$shadowList")]() {
    var current = this.$selection.current || {};
    return /*html*/`
      <object refClass="BoxShadowEditor" ref='$boxshadow' value="${current['box-shadow'] || ''}" hide-label="true" onChange="changeBoxShadow" />
    `
  }


  getTools() {
    return /*html*/`<button type="button" ref='$add'>${icon.add}</button>`
  }

  [CLICK('$add')] () {
    this.children.$boxshadow.trigger('add');
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {

    this.refreshShowIsNot(['project'])

  }  

  [EVENT("changeBoxShadow")](boxshadow) {

    this.command('setAttribute', 'change box shadow', { 
      'box-shadow': boxshadow
    })

  }
}

registElement({ BoxShadowProperty })