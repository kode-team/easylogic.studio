import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import { DEBOUNCE } from "../../../util/Event";


export default class FontProperty extends BaseProperty {

  getTitle() {
    return "Font";
  }

  getClassName() {
    return 'item'
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShow('text')
  }

  refresh() {
    // update 를 어떻게 할지 고민 
    var current = editor.selection.current;

    if (current) {
      this.children.$color.setValue(current['color'] || 'rgba(0, 0, 0, 1)')
      this.children.$size.setValue(current['font-size'])      
      this.children.$style.setValue(current['font-style'])
      this.children.$family.setValue(current['font-family'])
    }    
  }

  getBody() {
    return `
      <div class='property-item'>
        <RangeEditor 
          ref='$size' 
          label='Size' 
          key="font-size" 
          removable="true" 
          onchange="changeRangeEditor" />
      </div>
 
      <div class='property-item'>

        <NumberRangeEditor 
          ref='$weightRange' 
          label='Weight' 
          key='font-weight' 
          removable="true"
          value="400" 
          min="100"
          max="900"
          step="100"
          calc="false"
          unit="number" 
          onchange="changeRangeEditor" 
          />
      </div>              
      <div class='property-item'>
        <SelectIconEditor 
          ref='$style' 
          label='Style' 
          key="font-style" 
          options="normal,italic" 
          icons='I,I'
          onchange="changeRangeEditor" />
      </div>      

      <div class='property-item'>
        <SelectEditor 
          ref='$family' 
          icon="true"
          label='Family' 
          key="font-family" 
          options=",serif,sans-serif,monospace,cursive,fantasy,system-ui" 
          onchange="changeRangeEditor" 
        />
      </div> 
      <div class='property-item'>
        <ColorViewEditor ref='$color' label='Color' onchange="changeColor" />
      </div>           
    `;
  }


  [EVENT('changeColor')] (color) {
    this.trigger('changeRangeEditor', 'color', color);
  }

  [EVENT('changeRangeEditor')] (key, value) {

    editor.selection.reset({ 
      [key]: value
    })

    this.emit("refreshSelectionStyleView");
  }
}
