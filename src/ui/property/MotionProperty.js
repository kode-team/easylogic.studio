import BaseProperty from "./BaseProperty";
import { DEBOUNCE } from "@core/Event";
import { EVENT } from "@core/UIElement";

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
    this.refreshShowIsNot(['project']);
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
        <div class='group'>
          <span class='add-timeline-property' data-property='offset-path'></span>
        </div>
        <span refClass="OffsetPathListEditor" ref="$offsetPathList" key="offset-path" value="${current['offset-path']}" onchange="changRangeEditor" />
      </div>
    `;
  }

  [EVENT('changRangeEditor')] (key, value) {
    
    this.command('setAttribute', `change motion attribute : ${key}`, { 
      [key]: value 
    })

  }
}
