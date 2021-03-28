import BaseProperty from "./BaseProperty";

import { registElement } from "el/base/registerElement";
import { SUBSCRIBE } from "el/base/Event";

export default class TextFillProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('text.fill.property.title');
  }

  afterRender() {
    this.show();
  }

  [SUBSCRIBE('refreshSelection')]() {
    this.refresh();
  }

  refresh() {
    // update 를 어떻게 할지 고민 
    var current = this.$selection.current;

    if (current) {
      this.children.$fillColor.setValue(current['text-fill-color'] || 'rgba(0, 0, 0, 1)')      
      this.children.$strokeColor.setValue(current['text-stroke-color'] || 'rgba(0, 0, 0, 1)')      
      this.children.$width.setValue(current['text-stroke-width'] || '0px')      
    }
  }

  getBody() {
    return /*html*/`
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='text-fill-color'></span>
        </div>
        <object refClass="ColorViewEditor" ref='$fillColor' label='${this.$i18n('text.fill.property.fill')}' key='text-fill-color' onchange="changeColor" />
      </div>           
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='text-stroke-color'></span>
        </div>
        <object refClass="ColorViewEditor" ref='$strokeColor' label='${this.$i18n('text.fill.property.stroke')}' key='text-stroke-color' onchange="changeColor" />
      </div>                 

      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='text-stroke-width'></span>
        </div>
        <object refClass="RangeEditor"  
          ref='$width' 
          label='${this.$i18n('text.fill.property.strokeWidth')}' 
          key="text-stroke-width" 
          
          max="50"
          onchange="changeRangeEditor" />
      </div>
    
    `;
  }

  [SUBSCRIBE('changeColor')] (key, color, params) {
    this.trigger('changeRangeEditor', key, color);
  }

  [SUBSCRIBE('changeRangeEditor')] (key, value) {
    this.command('setAttribute', 'change text fill', { [key]: value })
  }
}

registElement({ TextFillProperty })