import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import { Length } from "../../../../../editor/unit/Length";


export default class FontProperty extends BaseProperty {

  getTitle() {
    return "Font";
  }

  initState() {
    return {
      'font-size': Length.px(13)
    }
  }

  [EVENT('refreshSelection')]() {
    var current = editor.selection.current;

    if (current) {
      this.children.$size.setValue(current['font-size'])
      this.children.$lineHeight.setValue(current['line-height'])
      this.children.$style.setValue(current['font-style'])
      this.children.$family.setValue(current['font-family'])
    }
  }

  refresh() {
    // update 를 어떻게 할지 고민 
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
        <RangeEditor 
          ref='$lineHeight' 
          label='line-height' 
          removable="true" 
          key="line-height" 
          onchange="changeRangeEditor" />
      </div>   
 
      <div class='property-item'>

        <NumberRangeEditor 
          ref='$weightRange' 
          label='Weight' 
          key='font-weight' 
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
          options=",normal,italic,oblique" 
          onchange="changeRangeEditor" />
      </div>      

      <div class='property-item'>
        <SelectEditor 
          ref='$family' 
          label='Family' 
          key="font-family" 
          options=",serif,sans-serif,monospace,cursive,fantasy,system-ui" 
          onchange="changeRangeEditor" 
        />
      </div>      
    `;
  }

  [EVENT('changeRangeEditor')] (key, value) {

    editor.selection.reset({ 
      [key]: value
    })

    this.emit("refreshSelectionStyleView");
  }
}
