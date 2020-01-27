import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import { DEBOUNCE, THROTTLE } from "../../../util/Event";

const i18n = editor.initI18n('size.property');

export default class SizeProperty extends BaseProperty {

  isHideHeader() {
    return true; 
  }  

  getTitle() {
    return i18n('title');
  }

  [EVENT('refreshSelection')]() {
    this.refreshShowIsNot('project');
  }

  [EVENT('refreshRect') + THROTTLE(100)] () {
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
      <div style='display: grid;grid-template-columns: repeat(2, 1fr); grid-column-gap: 10px; padding-top: 10px;'>
        <div class='property-item animation-property-item' style='padding:0px'>
          <span class='add-timeline-property' data-property='width'></span>
          <InputRangeEditor ref='$width' key='width' min="0" max='3000' onchange='changRangeEditor' />
        </div>
        <div class='property-item animation-property-item' style='padding:0px'>
          <span class='add-timeline-property' data-property='height'></span>      
          <InputRangeEditor ref='$height' key='height' min="0" max='3000' onchange='changRangeEditor' />
        </div>      
      </div>
      <div style='display: grid;grid-template-columns: repeat(2, 1fr); grid-column-gap: 10px; text-align: center;padding: 4px 0px;'>
        <span>${i18n('width')}</span>
        <span>${i18n('height')}</span>
      </div>
    `;
  }

  [EVENT('changRangeEditor')] (key, value) {

    editor.selection.reset({
      [key]: value
    })

    this.emit('refreshSelectionStyleView');
    this.emit('refreshAllElementBoundSize')
  }
}
