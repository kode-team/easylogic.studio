import BaseProperty from "./BaseProperty";
import { DEBOUNCE } from "../../../util/Event";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";


import RangeEditor from "../property-editor/RangeEditor";
import SelectEditor from "../property-editor/SelectEditor";


export default class SizeProperty extends BaseProperty {
  components() {
    return {
      RangeEditor,
      SelectEditor
    }
  }

  isHideHeader() {
    return true; 
  }

  getTitle() {
    return "Size";
  }

  [EVENT('refreshSelection', 'refreshRect')]() {
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
    return /*html*/`
      <div class='property-item animation-property-item'>
        <span class='add-timeline-property' data-property='width'></span>
        <RangeEditor ref='$width' label='Width' removable="true" key='width' min="0" max='3000' onchange='changRangeEditor' />
      </div>
      <div class='property-item animation-property-item'>
        <span class='add-timeline-property' data-property='height'></span>      
        <RangeEditor ref='$height' label='Height' removable="true" key='height' min="0" max='3000' onchange='changRangeEditor' />
      </div>      
    `;
  }

  [EVENT('changRangeEditor')] (key, value) {

    editor.selection.reset({
      [key]: value
    })

    this.emit('refreshSelectionStyleView');
    // this.emit('refreshSelectionTool');
    this.emit('setSize')

    // this.emit('change.property', key)    

  }
}
