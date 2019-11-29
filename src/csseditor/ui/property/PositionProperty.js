import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE } from "../../../util/Event";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";


export default class PositionProperty extends BaseProperty {
  getTitle() {
    return editor.i18n('position.property.title');
  }

  [EVENT('refreshSelection', 'refreshRect') + DEBOUNCE(100)]() {

    this.refreshShowIsNot('artboard')

  }

  getBody() {
    return /*html*/`
      <div class="position-item" ref="$positionItem"></div>
    `;
  }

  [LOAD("$positionItem")]() {
    var current = editor.selection.current;
    if (!current) return '';

    return /*html*/`
      <!--
      <div class='property-item'>
        <SelectIconEditor ref='$position' icon="true" key='position' value='${current.position}' options='absolute,relative,fixed,static' onchange="changRangeEditor" />
      </div>    -->
      <div class='property-item animation-property-item'>
        <span class='add-timeline-property' data-property='x'></span>
        <RangeEditor ref='$x' label='X' key='x' value='${current.x}' min="-1000" max='1000' onchange='changRangeEditor' />
      </div>
      <div class='property-item animation-property-item'>
        <span class='add-timeline-property' data-property='y'></span>
        <RangeEditor ref='$y' label='Y' key='y' value='${current.y}' min="-1000" max='1000' onchange='changRangeEditor' />
      </div>
    `;
  }


  [EVENT('changRangeEditor')] (key, value) {

    editor.selection.reset({
      [key]: value
    })

    this.emit('refreshSelectionStyleView');
    // this.emit('change.property', key)        
  }
}
