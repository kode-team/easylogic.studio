import BaseProperty from "./BaseProperty";
import { DEBOUNCE } from "@core/Event";
import { EVENT } from "@core/UIElement";
import { registElement } from "@core/registerElement";

const overflow_list = [
  'visible',
  'hidden',
  'scroll',
  'auto'
]

export default class AppearanceProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('background.color.property.title');
  }

  getOverflowList () {
    return overflow_list.map(it => {
      return `${it}:${this.$i18n(`background.color.property.overflow.${it}`)}`
    }).join(',');
  }  

  getBody() {
    return /*html*/`
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='background-color'></span>
        </div>
        <object refClass="ColorViewEditor" ref='$color' label="${this.$i18n('background.color.property.color')}" key='background-color' onchange="changeColor" />
      </div>   
        <div class='property-item animation-property-item' style='display:none;'>
          <div class='group'>
            <span class='add-timeline-property' data-property='z-index'></span>
          </div>
          <object refClass="NumberRangeEditor"  
            ref='$zIndex' 
            key='z-index' 
            label='${this.$i18n('background.color.property.zindex')}'
            min="-1000"
            max="1000"
            step="1"
            onchange="changeSelect" />
        </div>
        
        <div class='property-item animation-property-item'>
          <div class='group'>
            <span class='add-timeline-property' data-property='mix-blend-mode'></span>
          </div>
          <object refClass="BlendSelectEditor" 
            label='${this.$i18n('background.color.property.blend')}'
            ref='$mixBlend' 
            removable='true'
            key='mix-blend-mode' 
            icon="true" 
            tabIndex="1"
            onchange="changeSelect" />
        </div>        

        <div class='property-item animation-property-item'>
          <div class='group'>
            <span class='add-timeline-property' data-property='overflow'></span>
          </div>
          <object refClass="SelectEditor"  
            label='${this.$i18n('background.color.property.overflow')}'
            ref='$overflow' 
            removable='true'
            key='overflow' 
            icon="true" 
            tabIndex="1"
            options="${this.getOverflowList()}" 
            onchange="changeSelect" />
        </div>                
      `;
  }  

  [EVENT('changeColor')] (key, color) {
    this.command('setAttribute', 'change background color', { 
      [key]: color
    })
  }  


  refresh () {
    var current = this.$selection.current; 

    if (current) {
      this.children.$zIndex.setValue(current['z-index'] || 0)
      this.children.$mixBlend.setValue(current['mix-blend-mode'])
      this.children.$overflow.setValue(current['overflow']);
      this.children.$color.setValue(current['background-color'] || 'rgba(0, 0, 0, 1)')

    }
  }


  [EVENT('changeSelect')] (key, value) {
    this.command("setAttribute", `change attribute : ${key}`, { 
      [key]: value
    })
  }

  [EVENT('refreshSelection')]() {
    this.refreshShow(['project', 'artboard', 'rect', 'circle', 'image', 'video', 'iframe', 'text']);
  }
}

registElement({ AppearanceProperty })