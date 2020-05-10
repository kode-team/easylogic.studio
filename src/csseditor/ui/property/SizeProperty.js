import BaseProperty from "./BaseProperty";
import { EVENT } from "../../../util/UIElement";
import { THROTTLE } from "../../../util/Event";

export default class SizeProperty extends BaseProperty {

  isHideHeader() {
    return true; 
  }  

  getTitle() {
    return this.$i18n('size.property.title');
  }

  [EVENT('refreshSelection')]() {
    this.refreshShowIsNot('project');
  }

  [EVENT('refreshRect') + THROTTLE(100)] () {
    this.refresh();
  }

  refresh() {
    var current = this.$selection.current;
    if (current) {
      this.children.$width.setValue(current.width);
      this.children.$height.setValue(current.height);
    }
  }

  getBody() {
    return /*html*/`
      <div style='display: grid;grid-template-columns: repeat(2, 1fr); grid-column-gap: 10px; padding-top: 10px;'>
        <div class='property-item animation-property-item' style='padding:0px'>
          <div class='group'>
            <span class='add-timeline-property' data-property='width'></span>
          </div>
          <InputRangeEditor ref='$width' key='width' min="0" max='3000' onchange='changRangeEditor' />
        </div>
        <div class='property-item animation-property-item' style='padding:0px'>
          <div class='group'>
            <span class='add-timeline-property' data-property='height'></span>      
          </div>
          <InputRangeEditor ref='$height' key='height' min="0" max='3000' onchange='changRangeEditor' />
        </div>      
      </div>
      <div style='display: grid;grid-template-columns: repeat(2, 1fr); grid-column-gap: 10px; text-align: center;padding: 4px 0px;'>
        <span>${this.$i18n('size.property.width')}</span>
        <span>${this.$i18n('size.property.height')}</span>
      </div>
    `;
  }

  [EVENT('changRangeEditor')] (key, value) {

    this.$selection.reset({
      [key]: value
    })
    this.$selection.setRectCache();

    this.emit('setAttribute', { 
      [key]: value
    })

    this.emit('refreshSelectionTool')
  }
}
