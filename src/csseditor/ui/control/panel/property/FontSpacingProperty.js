import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import {
  CHANGE_SELECTION,
  CHANGE_EDITOR,
  CHANGE_ARTBOARD
} from "../../../../types/event";
import RangeEditor from "../property-editor/RangeEditor";



export default class FontSpacingProperty extends BaseProperty {
  components () {
    return {
      RangeEditor
    }
  }
  getTitle() {
    return "Spacing";
  }

  [EVENT(CHANGE_EDITOR, CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }

  refresh() {
    // TODO: 업데이트를 어떻게 할까? 
  }

  getBody() {
    return `
      <div class="property-item font-item">
        <RangeEditor ref='$letter' label='Letter' removable='true' key="letter-spacing" onchange="changeRangeEditor" />
      </div>

      <div class="property-item font-item">
        <RangeEditor ref='$word' label='Word' removable='true' key="word-spacing" onchange="changeRangeEditor" />
      </div>

      <div class="property-item font-item">
        <RangeEditor ref='$indent' label='Indent' removable='true' key="text-indent" onchange="changeRangeEditor" />
      </div>      
    `;
  }

  [EVENT('changeRangeEditor')] (key, value) {
    var current = editor.selection.current;
    if (!current) return;

    current.reset({
      [key]: value
    })

    this.emit('refreshCanvas')
  }

}
