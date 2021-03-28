import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE, SUBSCRIBE } from "el/base/Event";

import { registElement } from "el/base/registerElement";

export default class BackgroundClipProperty extends BaseProperty {
  
  getTitle() {
    return "Background Clip";
  }

  isFirstShow() {
    return false; 
  }

  getTools() {
    return /*html*/`<div ref='$backgroundClip' style='padding-top: 3px;'></div>`;
  }  

  [LOAD("$backgroundClip")]() {
    var current = this.$selection.current || {};

    var clip = current['background-clip'] || ''
    return /*html*/`<object refClass="SelectEditor"  ref='$1' key='background-clip' icon="true" value="${clip}" options=",paddinb-box,border-box,content-box,text" onchange="changeSelect" />`;
  }

  [SUBSCRIBE('changeSelect')] (key, value) {
      this.command('setAttribute', "change background clip", {
        [key]: value
      })
  }

  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShow(['rect', 'circle', 'text']);
  }  
}

registElement({ BackgroundClipProperty })