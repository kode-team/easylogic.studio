import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { LOAD } from "../../../../../util/Event";
import { EVENT } from "../../../../../util/UIElement";



export default class OpacityProperty extends BaseProperty {

  getTitle() {
    return 'Opacity'
  }

  getBody() {
    return `<div ref='$body' class='property-item'></div>`;
  }  

  [LOAD("$body")]() {
    var current = editor.selection.current || {};

    var opacity = current['opacity'] || '1'
    return `<NumberRangeEditor 
              ref='$1' 
              key='opacity' 
              value="${opacity}" 
              min="0"
              max="1"
              step="0.01"
              selected-unit=' '
              removable="true"
              onchange="changeSelect" />`;
  }

  [EVENT('changeSelect')] (key, value) {

    editor.selection.reset({
      [key]: value.value
    })

    this.emit("refreshSelectionStyleView");
  }

  [EVENT('refreshSelection')]() {
    this.refresh();
  }
}
