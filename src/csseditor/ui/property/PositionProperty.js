import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE } from "../../../util/Event";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";

const i18n = editor.initI18n('position.property')

export default class PositionProperty extends BaseProperty {
  getTitle() {
    return i18n('title');
  }

  [EVENT('refreshSelection', 'refreshRect') + DEBOUNCE(100)]() {

    this.refreshShowIsNot('artboard')

  }

  isHideHeader() {
    return true; 
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
      <div style='display: grid;grid-template-columns: repeat(2, 1fr); grid-column-gap: 10px;'>
        <div class='property-item animation-property-item' style='padding: 0px;'>
          <span class='add-timeline-property' data-property='x'></span>
          <InputRangeEditor ref='$x' key='x' value='${current.x}' min="-1000" max='1000' onchange='changRangeEditor' />
        </div>
        <div class='property-item animation-property-item' style='padding: 0px;'>
          <span class='add-timeline-property' data-property='y'></span>
          <InputRangeEditor ref='$y' key='y' value='${current.y}' min="-1000" max='1000' onchange='changRangeEditor' />
        </div>
      </div>
      <div style='display: grid;grid-template-columns: repeat(2, 1fr); grid-column-gap: 10px; text-align: center;padding: 4px 0px;'>
        <span>${i18n('X')}</span>
        <span>${i18n('Y')}</span>
      </div>      
    `;
  }


  [EVENT('changRangeEditor')] (key, value) {

    editor.selection.reset({
      [key]: value
    })

    this.emit('refreshSelectionStyleView'); 
  }
}
