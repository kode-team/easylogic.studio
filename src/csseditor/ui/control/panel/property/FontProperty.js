import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";


export default class FontProperty extends BaseProperty {

  getTitle() {
    return "Font";
  }

  [EVENT('refreshSelection')]() {
    this.refresh();
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
        <SelectEditor 
          ref='$style' 
          label='Style' 
          key="font-style" 
          options=",normal,italic,oblique" 
          onchange="changeRangeEditor" />
      </div>      
      <div class='property-item'>
        <SelectEditor 
          ref='$weight' 
          label='Weight' 
          key="font-weight" 
          options=",normal,bold,lighter,bolder,100,200,300,400,500,600,700,800,900" 
          onchange="changeRangeEditor" 
        />
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
    var current = editor.selection.current;
    if (!current) return; 

    current.reset({
      [key]: value
    }); 

    this.emit('refreshElement', current);
  }
}
