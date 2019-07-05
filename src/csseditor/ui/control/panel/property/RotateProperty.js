import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { LOAD } from "../../../../../util/Event";
import { EVENT } from "../../../../../util/UIElement";
import { Length } from "../../../../../editor/unit/Length";

export default class RotateProperty extends BaseProperty {

  getTitle() {
    return 'Rotate'
  }
  getBody() {
    return `<div ref='$body' style='padding-top: 3px;'></div>`;
  }  

  [LOAD("$body")]() {
    var current = editor.selection.current || {};

    var rotate = current['rotate'] || Length.deg(0)
    return `<RangeEditor 
              ref='$1' 
              key='rotate' 
              value="${rotate}" 
              min="-360"
              max="360"
              step="0.1"
              units='deg,trun'
              removable="true"
              onchange="changeSelect" />`;
  }

  [EVENT('changeSelect')] (key, value) {

    
    editor.selection.reset({
      [key]: value
    })

    this.emit("refreshSelectionStyleView");    
  }

  [EVENT('refreshSelection')]() {
    this.refresh();
  }
}
