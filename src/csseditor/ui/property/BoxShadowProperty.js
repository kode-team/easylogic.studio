import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE, CLICK } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";


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
      <BoxShadowEditor ref='$boxshadow' value="${current['box-shadow'] || ''}" hide-label="true" onChange="changeBoxShadow" />
    `
  }


  getTools() {
    return /*html*/`<button type="button" ref='$add'>${icon.add}</button>`
  }

  [CLICK('$add')] () {
    this.children.$boxshadow.trigger('add');
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {

    this.refreshShow(['artboard', 'rect', 'circle', 'text'])

  }  

  [EVENT("changeBoxShadow")](boxshadow) {

    this.emit('setAttribute', { 
      'box-shadow': boxshadow
    })

  }
}
