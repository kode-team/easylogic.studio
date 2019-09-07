import BaseProperty from "./BaseProperty";
import { DEBOUNCE } from "../../../util/Event";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";

import OffsetPathListEditor from "../property-editor/OffsetPathListEditor";
import RangeEditor from "../property-editor/RangeEditor";


export default class MotionProperty extends BaseProperty {
  components() {
    return {
      OffsetPathListEditor,
      RangeEditor
    }
  }

  getTitle() {
    return "Motion";
  }

  [EVENT('refreshSelection', 'refreshRect') + DEBOUNCE(100)]() {
    this.refreshShowIsNot('project');
  }

  refresh() {
    var current = editor.selection.current;
    if (current) {
      this.children.$offsetPathList.setValue(current['offset-path'])   
    }
  }

  getBody() {
    var current = editor.selection.current || {'offset-path': ''};
    return /*html*/`
      <div class='property-item animation-property-item'>
        <span class='add-timeline-property' data-property='offset-path'></span>
        <OffsetPathListEditor ref="$offsetPathList" key="offset-path" value="${current['offset-path']}" onchange="changRangeEditor" />
      </div>
    `;
  }

  [EVENT('changRangeEditor')] (key, value) {
    // var path = this.state.paths[id] || '';

    editor.selection.reset({
      [key]: value 
    })

    this.emit('refreshSelectionStyleView')

  }
}
