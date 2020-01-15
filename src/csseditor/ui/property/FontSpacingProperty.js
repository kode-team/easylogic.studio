import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import { Length } from "../../../editor/unit/Length";
import { DEBOUNCE } from "../../../util/Event";

const i18n = editor.initI18n('font.spacing.property')

export default class FontSpacingProperty extends BaseProperty {

  getTitle() {
    return i18n('title');
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShowIsNot(['project'])
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
        label='${i18n('lineHeight')}' 
        key="line-height" 
        units=",px,%,em"
        onchange="changeRangeEditor" />
    </div>       
      <div class="property-item font-item">
        <RangeEditor ref='$letter' label='${i18n('letterSpacing')}' key="letter-spacing" onchange="changeRangeEditor" />
      </div>

      <div class="property-item font-item">
        <RangeEditor ref='$word' label='${i18n('wordSpacing')}' key="word-spacing" onchange="changeRangeEditor" />
      </div>

      <div class="property-item font-item">
        <RangeEditor ref='$indent' label='${i18n('indent')}' key="text-indent" onchange="changeRangeEditor" />
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
