import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE } from "@core/Event";
import { EVENT } from "@core/UIElement";

export default class PositionProperty extends BaseProperty {
  getTitle() {
    return this.$i18n('position.property.title');
  }

  [EVENT('refreshSelection')]() {
    this.refreshShowIsNot(['project', 'artboard'])
  }

  [EVENT('refreshRect') + DEBOUNCE(100)] () {
    var current = this.$selection.current;
    if (!current) return '';

    if (this.children.$x)  this.children.$x.setValue(current.x);
    if (this.children.$y)  this.children.$y.setValue(current.y);
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
    var current = this.$selection.current;
    if (!current) return '';

    return /*html*/`
      <div style='display: grid;grid-template-columns: repeat(2, 1fr); grid-column-gap: 10px;'>
        <div class='property-item animation-property-item' style='padding: 0px;'>
          <div class='group'>
            <span class='add-timeline-property' data-property='x'></span>
          </div>
          <InputRangeEditor ref='$x' key='x' value='${current.x}' min="-1000" max='1000' onchange='changRangeEditor' />
        </div>
        <div class='property-item animation-property-item' style='padding: 0px;'>
          <div class='group'>
            <span class='add-timeline-property' data-property='y'></span>
          </div>
          <InputRangeEditor ref='$y' key='y' value='${current.y}' min="-1000" max='1000' onchange='changRangeEditor' />
        </div>
      </div>
      <div style='display: grid;grid-template-columns: repeat(2, 1fr); grid-column-gap: 10px; text-align: center;padding: 4px 0px;'>
        <span>${this.$i18n('position.property.X')}</span>
        <span>${this.$i18n('position.property.Y')}</span>
      </div>      
    `;
  }


  [EVENT('changRangeEditor')] (key, value) {

    this.command('setAttribute', 'change position', { 
      [key]: value
    })

    this.emit('refreshAllElementBoundSize')    
  }
}
