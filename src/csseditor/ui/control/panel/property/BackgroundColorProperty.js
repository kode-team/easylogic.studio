import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { LOAD } from "../../../../../util/Event";
import { EVENT } from "../../../../../util/UIElement";
import {
  CHANGE_SELECTION,
  CHANGE_ARTBOARD
} from "../../../../types/event";

export default class BackgroundColorProperty extends BaseProperty {

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

  [EVENT(CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }
}
