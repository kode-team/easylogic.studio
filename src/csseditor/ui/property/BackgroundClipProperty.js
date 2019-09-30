import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { LOAD, DEBOUNCE } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";


const clip_list = [
  '',
  "padding-box",
  "border-box",
  "content-box",
  "text"
];

export default class BackgroundClipProperty extends BaseProperty {
  
  getTitle() {
    return "Background Clip";
  }

  isFirstShow() {
    return false; 
  }

  getTools() {
    return `<div ref='$backgroundClip' style='padding-top: 3px;'></div>`;
  }  

  [LOAD("$backgroundClip")]() {
    var current = editor.selection.current || {};

    var clip = current['background-clip'] || ''
    return /*html*/`<SelectEditor ref='$1' key='background-clip' icon="true" value="${clip}" options=",paddinb-box,border-box,content-box,text" onchange="changeSelect" />`;
  }

  [EVENT('changeSelect')] (key, value) {
    var current = editor.selection.current;

    if (current) {
      current.reset({
        [key]: value
      })

      this.emit("refreshElement", current);
    }
  }



  [EVENT('refreshSelection') + DEBOUNCE(100)]() {

    this.refreshShowIsNot('artboard')

  }  
}
