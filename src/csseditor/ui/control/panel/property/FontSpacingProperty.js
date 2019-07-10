import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import { Length } from "../../../../../editor/unit/Length";


export default class FontSpacingProperty extends BaseProperty {

  getTitle() {
    return "Spacing";
  }

  [EVENT('refreshSelection')]() {
    var current = editor.selection.current;

    if (current) {
      this.children.$lineHeight.setValue(current['line-height'] || Length.number(1))
      this.children.$letter.setValue(current['letter-spacing'])      
      this.children.$word.setValue(current['word-spacing'])
      this.children.$indent.setValue(current['text-indent'])
    }
  }

  refresh() {
    // TODO: 업데이트를 어떻게 할까? 
    
  }

  getBody() {
    return `

    <div class='property-item'>
      <RangeEditor 
        ref='$lineHeight' 
        label='line-height' 
        removable="true" 
        key="line-height" 
        units="number,px,%,em"
        onchange="changeRangeEditor" />
    </div>       
      <div class="property-item font-item">
        <RangeEditor ref='$letter' label='Letter' removable='true' key="letter-spacing" onchange="changeRangeEditor" />
      </div>

      <div class="property-item font-item">
        <RangeEditor ref='$word' label='Word' removable='true' key="word-spacing" onchange="changeRangeEditor" />
      </div>

      <div class="property-item font-item">
        <RangeEditor ref='$indent' label='Indent' removable='true' key="text-indent" onchange="changeRangeEditor" />
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
