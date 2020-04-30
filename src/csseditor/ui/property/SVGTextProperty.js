import BaseProperty from "./BaseProperty";
import { EVENT } from "../../../util/UIElement";
import { DEBOUNCE } from "../../../util/Event";

export default class SVGTextProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('svg.text.property.title');
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShow(['svg-textpath', 'svg-text', 'svg-tspan']);
  }

  refresh() {
   // TODO: 데이타 로드를 어떻게 해야할까? 
    var current = this.$selection.current;
    if (current) {

      this.setAllValue([
        'lengthAdjust',
        'textLength',
        'startOffset',
        'font-size',
        'font-weight',
        'font-style',
        'font-family',
        'text-anchor',
        'text'
      ])   
    }

  }

  setAllValue(list = []) {
    var current = this.$selection.current;
    if (!current) return; 

    list.forEach(key => {
      this.children[`$${key}`].setValue(current[key])          
    })
  }

  getBody() {
    return /*html*/`
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='text'></span>
        </div>
        <TextAreaEditor 
          ref='$text' 
          label='${this.$i18n('svg.text.property.textarea')}' 
          key="text"
          onchange="changeTextValue" />
      </div>        
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='font-size'></span>
        </div>
        <RangeEditor 
          ref='$font-size' 
          label='${this.$i18n('svg.text.property.size')}' 
          key="font-size" 
          min='0'
          max="1000" 
          onchange="changeTextValue" />
      </div>    
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='font-weight'></span>
        </div>
        <NumberRangeEditor 
          ref='$font-weight' 
          label='${this.$i18n('svg.text.property.weight')}' 
          key='font-weight' 
          value="400" 
          min="100"
          max="900"
          step="1"
          calc="false"
          unit="number" 
          onchange="changeTextValue" 
          />
      </div>              
      <div class='property-item'>
        <SelectIconEditor 
          ref='$font-style' 
          label='${this.$i18n('svg.text.property.style')}' 
          key="font-style" 
          options="normal,italic" 
          icons='I,I'
          onchange="changeTextValue" />
      </div>      
      <div class='property-item'>
        <SelectIconEditor 
          ref='$text-anchor' 
          label='${this.$i18n('svg.text.property.anchor')}' 
          key="text-anchor" 
          options="start,middle,end" 
          onchange="changeTextValue" />
      </div>            

      <div class='property-item'>
        <SelectEditor 
          ref='$font-family' 
          icon="true"
          label='${this.$i18n('svg.text.property.family')}' 
          key="font-family" 
          options=",serif,sans-serif,monospace,cursive,fantasy,system-ui" 
          onchange="changeTextValue" 
        />
      </div>       
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='lengthAdjust'></span>
        </div>
        <SelectEditor 
          ref='$lengthAdjust' 
          label='${this.$i18n('svg.text.property.length.adjust')}' 
          key='lengthAdjust' 
          value='spacing' 
          options="spacing,spacingAndGlyphs" 
          onchange='changeTextValue' />        
      </div>        
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='textLength'></span>
        </div>
        <RangeEditor 
          ref='$textLength' 
          label='${this.$i18n('svg.text.property.text.length')}' 
          key='textLength'
          min="0"
          max='1000'
          step="0.1"
          onchange='changeTextValue' />                
      </div>        
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='startOffset'></span>
        </div>
        <RangeEditor 
          ref='$startOffset' 
          label='${this.$i18n('svg.text.property.start.offset')}' 
          key='startOffset' 
          min="0"
          max='1000'
          step="0.1"          
          onchange='changeTextValue' />        
      </div>                    
    `
  }

  [EVENT('changeTextValue')] (key, value) {

    this.emit('setAttribute', { 
      [key]: value
    }, null, true)
  }

}
