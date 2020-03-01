import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
import { DEBOUNCE } from "../../../util/Event";

const i18n = editor.initI18n('text.fill.property')

export default class TextFillProperty extends BaseProperty {

  getTitle() {
    return i18n('title');
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShowIsNot('project');
  }

  refresh() {
    // update 를 어떻게 할지 고민 
    var current = editor.selection.current;

    if (current) {
      this.children.$fillColor.setValue(current['text-fill-color'] || 'rgba(0, 0, 0, 1)')      
      this.children.$strokeColor.setValue(current['text-stroke-color'] || 'rgba(0, 0, 0, 1)')      
      this.children.$width.setValue(current['text-stroke-width'] || '0px')      
    }
  }

  getBody() {
    return /*html*/`
      <div class='property-item animation-property-item'>
        <span class='add-timeline-property' data-property='text-fill-color'></span>
        <ColorViewEditor ref='$fillColor' label='${i18n('fill')}' key='text-fill-color' onchange="changeColor" />
      </div>           
      <div class='property-item animation-property-item'>
        <span class='add-timeline-property' data-property='text-stroke-color'></span>
        <ColorViewEditor ref='$strokeColor' label='${i18n('stroke')}' key='text-stroke-color' onchange="changeColor" />
      </div>                 

      <div class='property-item animation-property-item'>
        <span class='add-timeline-property' data-property='text-stroke-width'></span>
        <RangeEditor 
          ref='$width' 
          label='${i18n('strokeWidth')}' 
          key="text-stroke-width" 
          
          max="50"
          onchange="changeRangeEditor" />
      </div>
    
    `;
  }

  [EVENT('changeColor')] (key, color, params) {
    this.trigger('changeRangeEditor', key, color);
  }

  [EVENT('changeRangeEditor')] (key, value) {
    this.emit('SET_ATTRIBUTE', { [key]: value })
  }
}
