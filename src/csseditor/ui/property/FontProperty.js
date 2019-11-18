import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import { DEBOUNCE } from "../../../util/Event";


export default class FontProperty extends BaseProperty {

  getTitle() {
    return editor.i18n('font.property.title');
  }

  getClassName() {
    return 'item'
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShow(['text'])
  }

  refresh() {
    
    var current = editor.selection.current;

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
        <span class='add-timeline-property' data-property='color'></span>
        <ColorViewEditor ref='$color' label='${editor.i18n('font.property.color')}' key='color' onchange="changeColor" />
      </div>      
      <div class='property-item animation-property-item'>
        <span class='add-timeline-property' data-property='font-size'></span>
        <RangeEditor 
          ref='$size' 
          label='${editor.i18n('font.property.size')}' 
          key="font-size" 
          removable="true" 
          onchange="changeRangeEditor" />
      </div>
      <div class='property-item animation-property-item'>
        <span class='add-timeline-property' data-property='font-stretch'></span>
        <RangeEditor 
          ref='$stretch' 
          label='${editor.i18n('font.property.stretch')}' 
          key="font-stretch" 
          removable="true" 
          units='%',
          onchange="changeRangeEditor" />
      </div>      
 
      <div class='property-item animation-property-item'>
        <span class='add-timeline-property' data-property='font-weight'></span>
        <NumberRangeEditor 
          ref='$weightRange' 
          label='${editor.i18n('font.property.weight')}' 
          key='font-weight' 
          removable="true"
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
        <SelectIconEditor 
          ref='$style' 
          label='${editor.i18n('font.property.style')}' 
          key="font-style" 
          options="normal,italic" 
          icons='I,I'
          onchange="changeRangeEditor" />
      </div>      

      <div class='property-item'>
        <SelectEditor 
          ref='$family' 
          icon="true"
          label='${editor.i18n('font.property.family')}' 
          key="font-family" 
          options=",serif,sans-serif,monospace,cursive,fantasy,system-ui" 
          onchange="changeRangeEditor" 
        />
      </div> 
         
    `;
  }


  [EVENT('changeColor')] (key, color) {
    this.trigger('changeRangeEditor', key, color);
  }

  [EVENT('changeRangeEditor')] (key, value) {

    editor.selection.reset({ 
      [key]: value
    })

    this.emit("refreshSelectionStyleView");
  }
}
