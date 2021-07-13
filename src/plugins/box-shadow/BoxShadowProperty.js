import { CLICK, DEBOUNCE, LOAD, SUBSCRIBE } from "el/base/Event";
import icon from "el/editor/icon/icon";
import BaseProperty from "el/editor/ui/property/BaseProperty";


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

  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100)]() {

    this.refreshShowIsNot(['project', 'svg-path', 'svg-polygon', 'svg-text', 'svg-textpath'])

  }  

  [SUBSCRIBE("changeBoxShadow")](boxshadow) {

    this.command('setAttribute', 'change box shadow', { 
      'box-shadow': boxshadow
    })

  }
}