import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";

import RangeEditor from "../property-editor/RangeEditor";
import SelectEditor from "../property-editor/SelectEditor";

export default class DisplayProperty extends BaseProperty {
  components() {
    return {
      RangeEditor,
      SelectEditor
    }
  }

  getTitle() {
    return "Position";
  }

  [EVENT('refreshSelection', 'refreshRect') + DEBOUNCE(100)]() {

    this.refreshShowIsNot('artboard')

  }

  getBody() {
    return `
      <div class="position-item" ref="$positionItem"></div>
    `;
  }

  [LOAD("$positionItem")]() {
    var current = this.$selection.current;
    if (!current) return '';

    return /*html*/`
      <div class='property-item'>
        <SelectEditor ref='$position' icon="true" label='position' key='position' value='${current.position}' options='absolute,relative,fixed,static' onchange="changRangeEditor" />
      </div>    
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='x'></span>
        </div>
        <RangeEditor ref='$x' label='X' key='x' removable="true" value='${current.x}' min="-1000" max='1000' onchange='changRangeEditor' />
      </div>
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='y'></span>
        </div>
        <RangeEditor ref='$y' label='Y' key='y' removable="true" value='${current.y}' min="-1000" max='1000' onchange='changRangeEditor' />
      </div>
    `;
  }


  [EVENT('changRangeEditor')] (key, value) {

    this.command('setAttribute', { 
      [key]: value
    })
  }
}
