import BaseProperty from "./BaseProperty";
import { LOAD } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import {
  CHANGE_SELECTION,
  CHANGE_ARTBOARD
} from "../../../../types/event";
import { EMPTY_STRING } from "../../../../../util/css/types";
import RangeEditor from "../property-editor/RangeEditor";
import SelectEditor from "../property-editor/SelectEditor";


export default class SizeProperty extends BaseProperty {
  components() {
    return {
      RangeEditor,
      SelectEditor
    }
  }

  getTitle() {
    return "Position";
  }

  isHideHeader() {
    return true; 
  }

  [EVENT(CHANGE_ARTBOARD, CHANGE_SELECTION, 'refreshRect')]() {
    this.refresh();
  }

  getBody() {
    return html`
      <div class="property-item size-item" ref="$sizeItem"></div>
    `;
  }

  [LOAD("$sizeItem")]() {
    var current = editor.selection.current;
    if (!current) return EMPTY_STRING;

    return `
      <div class='property-item'>
        <RangeEditor ref='$width' label='Width' removable="true" key='width' value='${current.width}' min="0" max='3000' onchange='changRangeEditor' />
      </div>
      <div class='property-item'>
        <RangeEditor ref='$height' label='Height' removable="true" key='height' value='${current.height}' min="0" max='3000' onchange='changRangeEditor' />
      </div>
    `;
  }

  [EVENT('changRangeEditor')] (key, value) {
    var current = editor.selection.current;
    if (current) {
      current.reset({
        [key]: value
      });

      this.emit("refreshCanvas");
      this.emit('setSize')
    }
  }
}
