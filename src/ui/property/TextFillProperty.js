import BaseProperty from "./BaseProperty";
import { EVENT } from "@core/UIElement";

export default class TextFillProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('text.fill.property.title');
  }

  afterRender() {
    this.show();
  }

  [EVENT('refreshSelection')]() {
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
        <span refClass="ColorViewEditor" ref='$fillColor' label='${this.$i18n('text.fill.property.fill')}' key='text-fill-color' onchange="changeColor" />
      </div>           
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='text-stroke-color'></span>
        </div>
        <span refClass="ColorViewEditor" ref='$strokeColor' label='${this.$i18n('text.fill.property.stroke')}' key='text-stroke-color' onchange="changeColor" />
      </div>                 

      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='text-stroke-width'></span>
        </div>
        <span refClass="RangeEditor"  
          ref='$width' 
          label='${this.$i18n('text.fill.property.strokeWidth')}' 
          key="text-stroke-width" 
          
          max="50"
          onchange="changeRangeEditor" />
      </div>
    
    `;
  }

  [EVENT('changeColor')] (key, color, params) {
    this.trigger('changeRangeEditor', key, color);
  }

  [EVENT('changeRangeEditor')] (key, value) {
    this.command('setAttribute', 'change text fill', { [key]: value })
  }
}
