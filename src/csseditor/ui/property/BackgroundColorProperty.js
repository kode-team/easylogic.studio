import BaseProperty from "./BaseProperty";
import { DEBOUNCE } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";

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
    return this.$i18n('background.color.property.title');
  }

  getBlendList () {
    return blend_list.map(it => {
      return `${it}:${this.$i18n(`blend.${it}`)}`
    }).join(',');
  }

  getOverflowList () {
    return overflow_list.map(it => {
      return `${it}:${this.$i18n(`background.color.property.overflow.${it}`)}`
    }).join(',');
  }  

  getBody() {
    return /*html*/`
        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='background-color'></span>
          <ColorViewEditor ref='$color' label="${this.$i18n('background.color.property.color')}" key='background-color' onchange="changeColor" />
        </div>

        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='z-index'></span>
          <NumberRangeEditor 
            ref='$zIndex' 
            key='z-index' 
            label='${this.$i18n('background.color.property.zindex')}'
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
            label='${this.$i18n('background.color.property.opacity')}'
            min="0"
            max="1"
            step="0.01"
            onchange="changeSelect" />
        </div>        
        
        <div class='property-item animation-property-item'>
          <span class='add-timeline-property' data-property='mix-blend-mode'></span>
          <SelectEditor 
            label='${this.$i18n('background.color.property.blend')}'
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
            label='${this.$i18n('background.color.property.overflow')}'
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
    var current = this.$selection.current; 

    if (current) {
      this.children.$color.setValue(current['background-color'] || 'rgba(0, 0, 0, 1)')
      this.children.$zIndex.setValue(current['z-index'] || 0)
      this.children.$opacity.setValue(current.opacity || '1')
      this.children.$mixBlend.setValue(current['mix-blend-mode'])
      this.children.$overflow.setValue(current['overflow'])
    }
  }


  [EVENT('changeSelect')] (key, value) {
    this.emit("setAttribute", { 
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
