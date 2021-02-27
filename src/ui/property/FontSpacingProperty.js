import BaseProperty from "./BaseProperty";
import { EVENT } from "@core/UIElement";
import { Length } from "@unit/Length";

export default class FontSpacingProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('font.spacing.property.title');
  }

  afterRender() {
    this.show();
  }

  [EVENT('refreshSelection')]() {
    this.refresh();
  }

  refresh() {
    
    var current = this.$selection.current;

    if (current) {
      this.children.$lineHeight.setValue(current['line-height'] || Length.number(1))
      this.children.$letter.setValue(current['letter-spacing'] || '0px')      
      this.children.$word.setValue(current['word-spacing'] || '0px')
      this.children.$indent.setValue(current['text-indent'] || '0px')
    }
  }

  getBody() {
    return /*html*/`

    <div class='property-item animation-property-item'>
      <div class='group'>
        <span class='add-timeline-property' data-property='line-height'></span>
      </div>
      <RangeEditor 
        ref='$lineHeight' 
        label='${this.$i18n('font.spacing.property.lineHeight')}' 
        key="line-height" 
        min="0"
        max="10"
        step="0.01"
        units=",px,%,em"
        onchange="changeRangeEditor" />
    </div>       
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='letter-spacing'></span>
        </div>
        <RangeEditor ref='$letter' label='${this.$i18n('font.spacing.property.letterSpacing')}' key="letter-spacing" min="-100" max="100" onchange="changeRangeEditor" />
      </div>

      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='word-spacing'></span>
        </div>
        <RangeEditor ref='$word' label='${this.$i18n('font.spacing.property.wordSpacing')}' key="word-spacing"  min="-100" max="100" onchange="changeRangeEditor" />
      </div>

      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='text-indent'></span>
        </div>      
        <RangeEditor ref='$indent' label='${this.$i18n('font.spacing.property.indent')}' key="text-indent"  min="-100" max="100" onchange="changeRangeEditor" />
      </div>      
    `;
  }

  [EVENT('changeRangeEditor')] (key, value) {

    if (value.unit === '') {
      value = Length.number(value.value)
    }

    this.command('setAttribute', `change font attribute: ${key}`, { 
      [key]: value
    })
  }

}
