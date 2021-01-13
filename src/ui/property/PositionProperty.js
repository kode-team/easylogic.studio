import BaseProperty from "./BaseProperty";
import { EVENT } from "@core/UIElement";

export default class PositionProperty extends BaseProperty {
  getTitle() {
    return this.$i18n('position.property.title');
  }

  afterRender() {
    this.show();
  }

  [EVENT('refreshSelection')]() {
    this.refreshShowIsNot(['project'])
  }

  [EVENT('refreshRect')] () {
    var current = this.$selection.current;
    if (!current) return '';

    this.children.$x.setValue(current.x || Length.z());
    this.children.$y.setValue(current.y || Length.z());
    this.children.$width.setValue(current.width || Length.z());
    this.children.$height.setValue(current.height || Length.z());    
  }

  isHideHeader() {
    return true; 
  }

  getBody() {
    return /*html*/`
      <div class="position-item" ref="$positionItem" style='padding: 5px 0px;'>
        <div style='display: grid;grid-template-columns: repeat(2, 1fr); grid-column-gap: 10px;'>
          <div class='property-item animation-property-item' style='padding: 0px;'>
            <div class='group'>
              <span class='add-timeline-property' data-property='x'></span>
            </div>
            <InputRangeEditor ref='$x' label="X" compact="true"  key='x' min="-1000" max='1000' onchange='changRangeEditor' />
          </div>
          <div class='property-item animation-property-item' style='padding: 0px;'>
            <div class='group'>
              <span class='add-timeline-property' data-property='y'></span>
            </div>
            <InputRangeEditor ref='$y' label="Y" compact="true"  key='y' min="-1000" max='1000' onchange='changRangeEditor' />
          </div>
        </div>
        <div style='display: grid;grid-template-columns: repeat(2, 1fr); grid-column-gap: 10px; padding-top: 10px;'>
          <div class='property-item animation-property-item' style='padding:0px'>
            <div class='group'>
              <span class='add-timeline-property' data-property='width'></span>
            </div>
            <InputRangeEditor ref='$width' label="W" compact="true" key='width' min="0" max='3000' onchange='changRangeEditor' />
          </div>
          <div class='property-item animation-property-item' style='padding:0px'>
            <div class='group'>
              <span class='add-timeline-property' data-property='height'></span>      
            </div>
            <InputRangeEditor ref='$height' label="H" compact="true" key='height' min="0" max='3000' onchange='changRangeEditor' />
          </div>      
        </div>        
      </div>
    `;
  }

  async refresh () {
    const current = this.$selection.current;
    if (current) {
      this.children.$x.setValue(current.x);
      this.children.$y.setValue(current.y);      
      this.children.$width.setValue(current.width);
      this.children.$height.setValue(current.height);         
    }

  }


  [EVENT('changRangeEditor')] (key, value) {

    this.command('setAttribute', 'change position or size', { 
      [key]: value
    })

    this.emit('refreshAllElementBoundSize')    
  }
}
