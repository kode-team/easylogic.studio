import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { DEBOUNCE } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";

const blendI18n = editor.initI18n('blend')
const overflowI18n = editor.initI18n('background.color.property.overflow')

const blend_list = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity"
];

const overflow_list = [
  'visible',
  'hidden',
  'scroll',
  'auto'
]

export default class BackgroundColorProperty extends BaseProperty {

  getTitle() {
    return editor.i18n('background.color.property.title');
  }

  getBlendList () {
    return blend_list.map(it => {
      return `${it}:${blendI18n(it)}`
    }).join(',');
  }

  getOverflowList () {
    return overflow_list.map(it => {
      return `${it}:${overflowI18n(it)}`
    }).join(',');
  }  

  getBody() {
    return /*html*/`
        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='background-color'></span>
          <ColorViewEditor ref='$color' label="${editor.i18n('background.color.property.color')}" key='background-color' onchange="changeColor" />
        </div>

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='z-index'></span>
          <NumberRangeEditor 
            ref='$zIndex' 
            key='z-index' 
            label='${editor.i18n('background.color.property.zindex')}'
            min="-1"
            max="100000"
            step="1"
            onchange="changeSelect" />
        </div>

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='opacity'></span>
          <NumberRangeEditor 
            ref='$opacity' 
            key='opacity' 
            label='${editor.i18n('background.color.property.opacity')}'
            min="0"
            max="1"
            step="0.01"
            onchange="changeSelect" />
        </div>        
        
        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='mix-blend-mode'></span>
          <SelectEditor 
            label='${editor.i18n('background.color.property.blend')}'
            ref='$mixBlend' 
            removable='true'
            key='mix-blend-mode' 
            icon="true" 
            options="${this.getBlendList()}" 
            onchange="changeSelect" />
        </div>        

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='overflow'></span>
          <SelectEditor 
            label='${editor.i18n('background.color.property.overflow')}'
            ref='$overflow' 
            removable='true'
            key='overflow' 
            icon="true" 
            options="${this.getOverflowList()}" 
            onchange="changeSelect" />
        </div>                
      `;
  }  

  refresh () {
    var current = editor.selection.current; 

    if (current) {
      this.children.$color.setValue(current['background-color'] || 'rgba(0, 0, 0, 1)')
      this.children.$zIndex.setValue(current['z-index'] || 0)
      this.children.$opacity.setValue(current.opacity || '1')
      this.children.$mixBlend.setValue(current['mix-blend-mode'])
      this.children.$overflow.setValue(current['overflow'])
    }
  }


  [EVENT('changeSelect')] (key, value) {
    this.emit("SET_ATTRIBUTE", { 
      [key]: value
    })
  }

  [EVENT('changeColor')] (key, color) {
    this.trigger('changeSelect', key, color);
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShowIsNot('project');
  }
}
