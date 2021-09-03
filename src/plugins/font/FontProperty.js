import { IF, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import BaseProperty from "el/editor/ui/property/BaseProperty";
import { variable } from 'el/sapa/functions/registElement';

export default class FontProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('font.property.title');
  }

  getClassName() {
    return 'item'
  }

  afterRender() {
    this.show();
  }

  get editableProperty() {
    return "font"
  }

  [SUBSCRIBE('refreshSelection') + IF('checkShow')]() {
    this.refresh();
  }

  refresh() {
    
    var current = this.$selection.current;

    if (current) {
      this.children.$color.setValue(current['color'] || 'rgba(0, 0, 0, 1)')
      this.children.$size.setValue(current['font-size'])      
      this.children.$stretch.setValue(current['font-stretch'] || '0%')      
      this.children.$style.setValue(current['font-style'])
      this.children.$family.setValue(current['font-family'])
    }    
  }

  getBody() {
    return /*html*/`
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='color'></span>
        </div>
        <object refClass="ColorViewEditor" ref='$color' label='${this.$i18n('font.property.color')}' key='color' onchange="changeColor" />
      </div>      
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='font-size'></span>
        </div>
        <object refClass="RangeEditor"  
          ref='$size' 
          label='${this.$i18n('font.property.size')}' 
          key="font-size" 
          
          onchange="changeRangeEditor" />
      </div>
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='font-stretch'></span>
        </div>
        <object refClass="RangeEditor"  
          ref='$stretch' 
          label='${this.$i18n('font.property.stretch')}' 
          key="font-stretch" 
          
          units='%',
          onchange="changeRangeEditor" />
      </div>      
 
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='font-weight'></span>
        </div>
        <object refClass="NumberRangeEditor"  
          ref='$weightRange' 
          label='${this.$i18n('font.property.weight')}' 
          key='font-weight' 
         
          value="400" 
          min="100"
          max="900"
          step="1"
          calc="false"
          unit="number" 
          onchange="changeRangeEditor" 
          />
      </div>              
      <div class='property-item'>
        <object refClass="SelectIconEditor" 
          ref='$style' 
          label='${this.$i18n('font.property.style')}' 
          key="font-style"
          compact="true"
          options=${variable(["normal","italic"])}
          icons='title,italic'
          onchange="changeRangeEditor" />
      </div>      

      <div class='property-item'>
        <object refClass="FontSelectEditor"  
          ref='$family' 
          icon="true"
          label='${this.$i18n('font.property.family')}' 
          key="font-family" 
          onchange="changeRangeEditor" 
        />
      </div> 
         
    `;
  }


  [SUBSCRIBE_SELF('changeColor')] (key, color) {
    this.trigger('changeRangeEditor', key, color);
  }

  [SUBSCRIBE_SELF('changeRangeEditor')] (key, value) {

    this.command('setAttributeForMulti', 'change font attribute', this.$selection.packByValue({ 
      [key]: value
    }))
  }
}