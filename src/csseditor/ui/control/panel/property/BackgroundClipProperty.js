import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { LOAD, DEBOUNCE } from "../../../../../util/Event";
import { EVENT } from "../../../../../util/UIElement";
import {
  CHANGE_SELECTION,
  
} from "../../../../types/event";

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

  getTools() {
    return `<div ref='$backgroundClip' style='padding-top: 3px;'></div>`;
  }  

  [LOAD("$backgroundClip")]() {
    var current = editor.selection.current || {};

    var clip = current['background-clip'] || ''
    return `<SelectEditor ref='$1' key='background-clip' value="${clip}" options="${clip_list.join(',')}" onchange="changeSelect" />`;
  }

  [EVENT('changeSelect')] (key, value) {
    var current = editor.selection.current;

    if (current) {
      current.reset({
        [key]: value
      })

      this.emit('refreshCanvas')
    }
  }



  [EVENT(CHANGE_SELECTION) + DEBOUNCE(100)]() {

    var current = editor.selection.current;
    if (current) {
      if (current.is('artboard')) {
        this.hide();
      } else {
        this.show();
        this.refresh();
      }
    } else {
      this.hide();
    }

  }  
}
