import { SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import BaseProperty from "el/editor/ui/property/BaseProperty";
import { variable } from 'el/sapa/functions/registElement';
import { createComponent } from "el/sapa/functions/jsx";


export default class SVGTextProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('svg.text.property.title');
  }

  [SUBSCRIBE('refreshSelection')]() {
    this.refreshShow(['svg-textpath', 'svg-text', 'svg-tspan']);
  }

  refresh() {
    var current = this.$selection.current;
    if (current) {

      this.setAllValue([
        'lengthAdjust',
        'textLength',
        'startOffset',
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
      <div class='property-item '>
        ${createComponent('TextAreaEditor', {
          ref: '$text',
          label: this.$i18n('svg.text.property.textarea'),
          key: "text",
          onchange: "changeTextValue"
        })}
      </div>        
      <div class='property-item'>
        ${createComponent("SelectIconEditor", {
          ref: '$text-anchor',
          label: this.$i18n('svg.text.property.anchor'),
          key: "text-anchor",
          options: ["start","middle","end"],
          onchange: "changeTextValue"
        })}
          
      </div>            
      <div class='property-item '>
        ${createComponent("SelectEditor" , {
          ref: '$lengthAdjust',
          label: this.$i18n('svg.text.property.length.adjust'),
          key: 'lengthAdjust',
          value: 'spacing',
          options: ["spacing","spacingAndGlyphs"],
          onchange: 'changeTextValue'
        })}
          
      </div>        
      <div class='property-item '>
        ${createComponent("RangeEditor", {
          ref: '$textLength',
          label: this.$i18n('svg.text.property.text.length'),
          key: 'textLength',
          min: 0,
          max: 1000,
          step: 0.1,
          onchange: 'changeTextValue'
        })}
          
      </div>        
      <div class='property-item '>
        ${createComponent("RangeEditor", {
          ref: '$startOffset',
          label: this.$i18n('svg.text.property.start.offset'),
          key: 'startOffset',
          min: 0,
          max: 1000,
          step: 0.1,
          onchange: 'changeTextValue'
        })}
          
      </div>                    
    `
  }

  [SUBSCRIBE_SELF('changeTextValue')] (key, value) {

    this.command('setAttributeForMulti', `change svg text property: ${key}`, this.$selection.packByValue({ 
      [key]: value
    }))
  }

}