import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { EMPTY_STRING } from "../../../../../util/css/types";
import { LOAD, CLICK, INPUT } from "../../../../../util/Event";
import { EVENT } from "../../../../../util/UIElement";
import {
  CHANGE_EDITOR,
  CHANGE_LAYER,
  CHANGE_SELECTION,
  CHANGE_ARTBOARD
} from "../../../../types/event";
import ColorViewEditor from "../property-editor/ColorViewEditor";



export default class BackgroundColorProperty extends BaseProperty {
  components() {
    return {
      ColorViewEditor
    }
  }

  getTitle() {
    return "Background Color";
  }

  getBody() {
    return `<div class='property-item background-color' ref='$backgroundColor'></div>`;
  }  

  [LOAD("$backgroundColor")]() {
    var current = editor.selection.current || {};

    var color = current['background-color'] || 'rgba(0, 0, 0, 1)';
    return `<ColorViewEditor ref='$1' color="${color}" onchange="changeColor" />`;
  }

  [EVENT('changeColor')] (color) {
    var current = editor.selection.current;

    if (current) {
      current.reset({
        'background-color': color
      })

      this.emit('refreshCanvas')
    }
  }

  [EVENT(CHANGE_EDITOR, CHANGE_LAYER, CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }
}
