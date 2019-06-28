import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE } from "../../../../../util/Event";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import {
  CHANGE_SELECTION,
  CHANGE_ARTBOARD
} from "../../../../types/event";

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

  [EVENT(CHANGE_ARTBOARD, CHANGE_SELECTION, 'refreshRect') + DEBOUNCE(100)]() {
    this.refresh();
  }

  getBody() {
    return `
      <div class="property-item size-item" ref="$sizeItem"></div>
    `;
  }

  [LOAD("$sizeItem")]() {
    var current = editor.selection.current;
    if (!current) return '';

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
