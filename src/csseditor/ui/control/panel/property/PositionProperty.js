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



export default class PositionProperty extends BaseProperty {
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
      <div class="property-item position-item" ref="$positionItem"></div>
    `;
  }

  [LOAD("$positionItem")]() {
    var current = editor.selection.current;
    if (!current) return EMPTY_STRING;

    return `
      <div class='property-item'>
        <SelectEditor ref='$position' label='position' key='position' value='${current.position}' options=',absolute,relative,fixed,static' onchange="changRangeEditor" />
      </div>    
      <div>
        <RangeEditor ref='$x' label='X' key='x' removable="true" value='${current.x}' min="-1000" max='1000' onchange='changRangeEditor' />
      </div>
      <div>
        <RangeEditor ref='$y' label='Y' key='y' removable="true" value='${current.y}' min="-1000" max='1000' onchange='changRangeEditor' />
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
    }
  }
}
