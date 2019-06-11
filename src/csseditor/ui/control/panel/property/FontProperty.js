import BaseProperty from "./BaseProperty";
import { INPUT, CHANGE } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { editor } from "../../../../../editor/editor";
import { Length } from "../../../../../editor/unit/Length";
import { EVENT } from "../../../../../util/UIElement";
import {
  CHANGE_SELECTION,
  CHANGE_EDITOR,
  CHANGE_ARTBOARD
} from "../../../../types/event";
import SelectEditor from "../../shape/property-editor/SelectEditor";
import RangeEditor from "../../shape/property-editor/RangeEditor";


export default class FontProperty extends BaseProperty {

  components() {
    return {
      SelectEditor,
      RangeEditor
    }
  }

  getTitle() {
    return "Font";
  }

  [EVENT(CHANGE_EDITOR, CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }

  refresh() {
    // update 를 어떻게 할지 고민 
  }

  getBody() {
    return html`

      <div class='property-item'>
        <RangeEditor ref='$size' label='Size' key="font-size" removable="true" onchange="changeRangeEditor" />
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
        <RangeEditor ref='$lineHeight' label='line-height' removable="true" key="line-height" onchange="changeRangeEditor" />
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

    this.emit('refreshCanvas')
  }
}
