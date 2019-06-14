import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { LOAD } from "../../../../../util/Event";
import { EVENT } from "../../../../../util/UIElement";
import {
  CHANGE_EDITOR,
  CHANGE_LAYER,
  CHANGE_SELECTION,
  CHANGE_ARTBOARD
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
    return "Mix Blend";
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

  [EVENT(CHANGE_EDITOR, CHANGE_LAYER, CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }
}
