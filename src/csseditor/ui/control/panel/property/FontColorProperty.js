import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { LOAD, DEBOUNCE } from "../../../../../util/Event";
import { EVENT } from "../../../../../util/UIElement";


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

    editor.selection.reset({ 
      'color': color
    })

    this.emit("refreshSelectionStyleView");
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShow('text')
  }

}
