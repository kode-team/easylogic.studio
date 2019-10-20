import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import { DEBOUNCE } from "../../../util/Event";


export default class SVGTextProperty extends BaseProperty {

  getTitle() {
    return "Text Style";
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShow(['svg-textpath', 'svg-text', 'svg-tspan']);
  }

  refresh() {
   // TODO: 데이타 로드를 어떻게 해야할까? 
    var current = editor.selection.current;
    if (current) {
      this.children.$lengthAdjust.setValue(current['lengthAdjust']);
      this.children.$textLength.setValue(current['textLength']);
      this.children.$startOffset.setValue(current['startOffset']);        
      this.children.$size.setValue(current['font-size'])  
      this.children.$weight.setValue(current['font-weight'])      
      this.children.$style.setValue(current['font-style'])
      this.children.$family.setValue(current['font-family'])    
      this.children.$text.setValue(current['text'])          
    }

  }

  getBody() {
    return /*html*/`
      <div class='property-item animation-property-item'>
        <span class='add-timeline-property' data-property='text'></span>
        <TextAreaEditor 
          ref='$text' 
          label='Text' 
          key="text"
          onchange="changeTextValue" />
      </div>        
      <div class='property-item animation-property-item'>
        <span class='add-timeline-property' data-property='font-size'></span>
        <RangeEditor 
          ref='$size' 
          label='Size' 
          key="font-size" 
          min='0'
          max="1000" 
          onchange="changeTextValue" />
      </div>    
      <div class='property-item animation-property-item'>
        <span class='add-timeline-property' data-property='font-weight'></span>
        <NumberRangeEditor 
          ref='$weight' 
          label='Weight' 
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
          ref='$style' 
          label='Style' 
          key="font-style" 
          options="normal,italic" 
          icons='I,I'
          onchange="changeTextValue" />
      </div>      

      <div class='property-item'>
        <SelectEditor 
          ref='$family' 
          icon="true"
          label='Family' 
          key="font-family" 
          options=",serif,sans-serif,monospace,cursive,fantasy,system-ui" 
          onchange="changeTextValue" 
        />
      </div>       
      <div class='property-item animation-property-item'>
        <span class='add-timeline-property' data-property='lengthAdjust'></span>
        <SelectEditor 
          ref='$lengthAdjust' 
          label='lengthAdjust' 
          key='lengthAdjust' 
          value='spacing' 
          options="spacing,spacingAndGlyphs" 
          onchange='changeTextValue' />        
      </div>        
      <div class='property-item animation-property-item'>
        <span class='add-timeline-property' data-property='textLength'></span>
        <RangeEditor 
          ref='$textLength' 
          label='textLength' 
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
          label='startOffset' 
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
