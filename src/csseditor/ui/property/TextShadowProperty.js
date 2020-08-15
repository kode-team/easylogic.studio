import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE, CLICK } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";


export default class TextShadowProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('text.shadow.property.title')
  }

  getBody() {
    return `
      <div class="full text-shadow-item" ref="$shadowList"></div>
    `;
  }

  hasKeyframe() {
    return true
  }

  getKeyframeProperty () {
    return 'text-shadow'
  }

  getTools() {
    return `<button type="button" ref='$add'>${icon.add}</button>`
  }

  [CLICK('$add')] () {
    this.children.$textshadow.trigger('add');
  }  
  
  [LOAD("$shadowList")]() {
    var current = this.$selection.current || {};
    return /*html*/`
      <TextShadowEditor ref='$textshadow' value="${current['text-shadow'] || ''}" hide-label="true" onChange="changeTextShadow" />
    `
  }

  afterRender() {
    this.show();
  }

  [EVENT('refreshSelection')]() {
    this.refresh();
  }  

  [EVENT("changeTextShadow")](textshadow) {

    this.command('setAttribute', 'change text shadow', { 
      'text-shadow': textshadow
    })
  }
}
