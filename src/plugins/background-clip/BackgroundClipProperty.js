import { LOAD, DEBOUNCE, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import BaseProperty from "el/editor/ui/property/BaseProperty";
import { variable } from "el/sapa/functions/registElement";

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
    return /*html*/`
      <object refClass="SelectEditor"  
          ref='$1' 
          key='background-clip' 
          icon="true" 
          value="${clip}" 
          options=${variable(["","paddinb-box","border-box","content-box","text"])} 
          onchange="changeSelect" 
      />`;
  }

  [SUBSCRIBE_SELF('changeSelect')] (key, value) {
      this.command('setAttributeForMulti', "change background clip", this.$selection.packByValue({
        [key]: value
      }))
  }

  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShow(['rect', 'circle', 'text']);
  }  
}