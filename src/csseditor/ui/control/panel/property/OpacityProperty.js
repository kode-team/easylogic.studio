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
import SingleRangeEditor from "../property-editor/SingleRangeEditor";


export default class OpacityProperty extends BaseProperty {
  components() {
    return {
      SingleRangeEditor
    }
  }

  getTitle() {
    return 'Opacity'
  }

  getBody() {
    return `<div ref='$body' style='padding-top: 3px;'></div>`;
  }  

  [LOAD("$body")]() {
    var current = editor.selection.current || {};

    var opacity = current['opacity'] || ''
    return `<SingleRangeEditor 
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
    var current = editor.selection.current;

    if (current) {
      current.reset({
        [key]: value.value
      })

      this.emit('refreshCanvas')
    }
  }

  [EVENT(CHANGE_EDITOR, CHANGE_LAYER, CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }
}
