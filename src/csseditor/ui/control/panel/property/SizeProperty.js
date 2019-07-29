import BaseProperty from "./BaseProperty";
import { DEBOUNCE } from "../../../../../util/Event";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";


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
    return "Size";
  }

  [EVENT('refreshSelection', 'refreshRect') + DEBOUNCE(100)]() {
    this.refreshShowIsNot('project');
  }

  refresh() {
    var current = editor.selection.current;
    if (current) {
      this.children.$width.setValue(current.width);
      this.children.$height.setValue(current.height);
    }
  }

  getBody() {
    return `
      <div class='property-item'>
        <RangeEditor ref='$width' label='Width' removable="true" key='width' min="0" max='3000' onchange='changRangeEditor' />
      </div>
      <div class='property-item'>
        <RangeEditor ref='$height' label='Height' removable="true" key='height' min="0" max='3000' onchange='changRangeEditor' />
      </div>      
    `;
  }

  [EVENT('changRangeEditor')] (key, value) {
    var current = editor.selection.current;
    if (current) {
      current.reset({
        [key]: value
      });

      this.emit('refreshElement', current);
      this.emit('setSize')
    }
  }
}
