import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import { DEBOUNCE } from "../../../util/Event";

const i18n = editor.initI18n('svg.text.property');

export default class SVGTextProperty extends BaseProperty {

  getTitle() {
    return i18n('title');
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShow(['svg-textpath', 'svg-text', 'svg-tspan']);
  }

  refresh() {
   // TODO: 데이타 로드를 어떻게 해야할까? 
    var current = editor.selection.current;
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
    var current = editor.selection.current;
    if (!current) return; 

    list.forEach(key => {
      this.children[`$${key}`].setValue(current[key])          
    })
  }

  getBody() {
    return /*html*/`
      <div class='property-item animation-property-item'>
        <span class='add-timeline-property' data-property='text'></span>
        <TextAreaEditor 
          ref='$text' 
          label='${i18n('textarea')}' 
          key="text"
          onchange="changeTextValue" />
      </div>        
      <div class='property-item animation-property-item'>
        <span class='add-timeline-property' data-property='font-size'></span>
        <RangeEditor 
          ref='$font-size' 
          label='${i18n('size')}' 
          key="font-size" 
          min='0'
          max="1000" 
          onchange="changeTextValue" />
      </div>    
      <div class='property-item animation-property-item'>
        <span class='add-timeline-property' data-property='font-weight'></span>
        <NumberRangeEditor 
          ref='$font-weight' 
          label='${i18n('weight')}' 
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
          label='${i18n('style')}' 
          key="font-style" 
          options="normal,italic" 
          icons='I,I'
          onchange="changeTextValue" />
      </div>      
      <div class='property-item'>
        <SelectIconEditor 
          ref='$text-anchor' 
          label='${i18n('anchor')}' 
          key="text-anchor" 
          options="start,middle,end" 
          onchange="changeTextValue" />
      </div>            

      <div class='property-item'>
        <SelectEditor 
          ref='$font-family' 
          icon="true"
          label='${i18n('family')}' 
          key="font-family" 
          options=",serif,sans-serif,monospace,cursive,fantasy,system-ui" 
          onchange="changeTextValue" 
        />
      </div>       
      <div class='property-item animation-property-item'>
        <span class='add-timeline-property' data-property='lengthAdjust'></span>
        <SelectEditor 
          ref='$lengthAdjust' 
          label='${i18n('length.adjust')}' 
          key='lengthAdjust' 
          value='spacing' 
          options="spacing,spacingAndGlyphs" 
          onchange='changeTextValue' />        
      </div>        
      <div class='property-item animation-property-item'>
        <span class='add-timeline-property' data-property='textLength'></span>
        <RangeEditor 
          ref='$textLength' 
          label='${i18n('text.length')}' 
          key='textLength'
          min="0"
          max='1000'
          step="0.1"
          onchange='changeTextValue' />                
      </div>        
      <div class='property-item animation-property-item'>
        <span class='add-timeline-property' data-property='startOffset'></span>
        <RangeEditor 
          ref='$startOffset' 
          label='${i18n('start.offset')}' 
          key='startOffset' 
          min="0"
          max='1000'
          step="0.1"          
          onchange='changeTextValue' />        
      </div>                    
    `
  }

  [EVENT('changeTextValue')] (key, value) {

    editor.selection.reset({ 
      [key]: value
    })

    this.emit("refreshSelectionStyleView");
  }

}
