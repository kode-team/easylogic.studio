import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import { Length } from "../../../editor/unit/Length";
import { DEBOUNCE } from "../../../util/Event";


export default class FontSpacingProperty extends BaseProperty {

  getTitle() {
    return editor.i18n('font.spacing.property.title');
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShow('text');
  }

  refresh() {
    
    var current = editor.selection.current;

    if (current) {
      this.children.$lineHeight.setValue(current['line-height'] || Length.number(1))
      this.children.$letter.setValue(current['letter-spacing'] || '0px')      
      this.children.$word.setValue(current['word-spacing'] || '0px')
      this.children.$indent.setValue(current['text-indent'] || '0px')
    }
  }

  getBody() {
    return /*html*/`

    <div class='property-item'>
      <RangeEditor 
        ref='$lineHeight' 
        label='${editor.i18n('font.spacing.property.lineHeight')}' 
        removable="true" 
        key="line-height" 
        units=",px,%,em"
        onchange="changeRangeEditor" />
    </div>       
      <div class="property-item font-item">
        <RangeEditor ref='$letter' label='${editor.i18n('font.spacing.property.letterSpacing')}' removable='true' key="letter-spacing" onchange="changeRangeEditor" />
      </div>

      <div class="property-item font-item">
        <RangeEditor ref='$word' label='${editor.i18n('font.spacing.property.wordSpacing')}' removable='true' key="word-spacing" onchange="changeRangeEditor" />
      </div>

      <div class="property-item font-item">
        <RangeEditor ref='$indent' label='${editor.i18n('font.spacing.property.indent')}' removable='true' key="text-indent" onchange="changeRangeEditor" />
      </div>      
    `;
  }

  [EVENT('changeRangeEditor')] (key, value) {

    if (value.unit === '') {
      value = Length.number(value.value)
    }

    editor.selection.reset({ 
      [key]: value
    })

    this.emit("refreshSelectionStyleView");
  }

}
