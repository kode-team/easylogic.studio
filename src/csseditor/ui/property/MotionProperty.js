import BaseProperty from "./BaseProperty";
import { DEBOUNCE } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";

import OffsetPathListEditor from "../property-editor/OffsetPathListEditor";


export default class MotionProperty extends BaseProperty {
  components() {
    return {
      OffsetPathListEditor
    }
  }

  getTitle() {
    return this.$i18n('motion.property.title');
  }

  [EVENT('refreshSelection', 'refreshRect') + DEBOUNCE(100)]() {
    this.refreshShowIsNot('project');
  }

  refresh() {
    var current = this.$selection.current;
    if (current) {
      this.children.$offsetPathList.setValue(current['offset-path'])   
    }
  }

  getBody() {
    var current = this.$selection.current || {'offset-path': ''};
    return /*html*/`
      <div class='property-item animation-property-item'>
        <span class='add-timeline-property' data-property='offset-path'></span>
        <OffsetPathListEditor ref="$offsetPathList" key="offset-path" value="${current['offset-path']}" onchange="changRangeEditor" />
      </div>
    `;
  }

  [EVENT('changRangeEditor')] (key, value) {
    
    this.emit('setAttribute', { 
      [key]: value 
    })

  }
}
