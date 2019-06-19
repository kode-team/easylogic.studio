import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { LOAD } from "../../../../../util/Event";
import { EVENT } from "../../../../../util/UIElement";
import {
  CHANGE_SELECTION,
  CHANGE_ARTBOARD
} from "../../../../types/event";

export default class FontColorProperty extends BaseProperty {

  getTitle() {
    return "Font Color";
  }
  getBody() {
    return `<div class='property-item font-color' ref='$color'></div>`;
  }

  [LOAD("$color")]() {
    var current = editor.selection.current || {};

    var color = current.color || 'rgba(0, 0, 0, 1)'
    
    return `<ColorViewEditor ref='$1' color="${color}" onchange="changeColor" />`;
  }

  [EVENT('changeColor')] (color) {
    var current = editor.selection.current;

    if (current) {
      current.reset({
        'color': color
      })

      this.emit('refreshCanvas')
    }
  }

  [EVENT(CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }

}
