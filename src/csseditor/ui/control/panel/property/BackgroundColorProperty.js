import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { LOAD, DEBOUNCE } from "../../../../../util/Event";
import { EVENT } from "../../../../../util/UIElement";


export default class BackgroundColorProperty extends BaseProperty {

  getTitle() {
    return "Background Color";
  }

  getBody() {
    return `<div class='property-item background-color' ref='$backgroundColor'></div>`;
  }  

  [LOAD("$backgroundColor")]() {
    var current = editor.selection.current || {};

    var color = current['background-color'] || 'rgba(0, 0, 0, 0)';
    return `<ColorViewEditor ref='$1' color="${color}" onchange="changeColor" />`;
  }

  [EVENT('changeColor')] (color) {

    editor.selection.reset({
      'background-color': color
    })

    this.emit("refreshSelectionStyleView");    
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShowIsNot('project');
  }
}
