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
import RangeEditor from "../../shape/property-editor/RangeEditor";

export default class PerspectiveProperty extends BaseProperty {
  components() {
    return {
      RangeEditor
    }
  }

  getTitle() {
    return "Perspective";
  }

  getBody() {
    return `<div ref='$perspective'></div>`;
  }  

  [LOAD("$perspective")]() {
    var current = editor.selection.current || {};

    var perspective = current['perspective'] || ''
    return `<RangeEditor ref='$1' key='perspective' value="${perspective}" onchange="changeRangeEdtior" />`;
  }

  [EVENT('changeRangeEdtior')] (key, value) {
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
