import BaseProperty from "./BaseProperty";
import { LOAD, CLICK, DEBOUNCE } from "@sapa/Event";
import { EVENT } from "@sapa/UIElement";
import icon from "@icon/icon";
import { registElement } from "@sapa/registerElement";

export default class PerspectiveProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('perspective.property.title')
  }

  hasKeyframe() {
    return true; 
  }


  isFirstShow() {
    return false; 
  }  

  getKeyframeProperty () {
    return 'perspective'
  }

  getTools() {
    return /*html*/`
        <button type="button" class="remove" ref='$remove'>${icon.remove}</button>
    `
  }


  [CLICK('$remove')] () {
    this.trigger('changePerspective', 'perspective', '');
  }  


  getBody() {
    return `<div class='property-item' ref='$perspective'></div>`;
  }  

  [LOAD("$perspective")]() {
    var current = this.$selection.current || {};

    var perspective = current['perspective'] || ''
    return /*html*/`
        <object refClass="RangeEditor"  ref='$1' key='perspective' value="${perspective}" max="2000px" onchange="changePerspective" />
    `;
  }

  [EVENT('changePerspective')] (key, value) {

    this.command('setAttribute', 'change perspective', { 
      [key]: value
    })
  }

  [EVENT('refreshSelection')]() {
    this.refreshShowIsNot(['project']);
  }
}

registElement({ PerspectiveProperty })