import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE } from "el/base/Event";


import "../property-editor/RangeEditor";
import "../property-editor/SelectEditor";
import { registElement } from "el/base/registerElement";

export default class DisplayProperty extends BaseProperty {

  getTitle() {
    return "Position";
  }

  [SUBSCRIBE('refreshSelection', 'refreshRect') + DEBOUNCE(100)]() {

    this.refreshShowIsNot('artboard')

  }

  getBody() {
    return /*html*/`
      <div class="position-item" ref="$positionItem"></div>
    `;
  }

  [LOAD("$positionItem")]() {
    var current = this.$selection.current;
    if (!current) return '';

    return /*html*/`
      <div class='property-item'>
        <object refClass="SelectEditor"  ref='$position' icon="true" label='position' key='position' value='${current.position}' options='absolute,relative,fixed,static' onchange="changRangeEditor" />
      </div>    
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='x'></span>
        </div>
        <object refClass="RangeEditor"  ref='$x' label='X' key='x' removable="true" value='${current.x}' min="-1000" max='1000' onchange='changRangeEditor' />
      </div>
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='y'></span>
        </div>
        <object refClass="RangeEditor"  ref='$y' label='Y' key='y' removable="true" value='${current.y}' min="-1000" max='1000' onchange='changRangeEditor' />
      </div>
    `;
  }


  [SUBSCRIBE('changRangeEditor')] (key, value) {

    this.command('setAttribute', 'change display', { 
      [key]: value
    })
  }
}

registElement({ DisplayProperty })