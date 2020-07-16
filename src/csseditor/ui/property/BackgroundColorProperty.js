import BaseProperty from "./BaseProperty";
import { DEBOUNCE } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";
import { Transform } from "../../../editor/css-property/Transform";
import { Length } from "../../../editor/unit/Length";

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

  isHideHeader() {
    return true; 
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
          <span class='add-timeline-property' data-property='rotate'></span>
        </div>
        <RangeEditor 
          ref='$rotate' 
          key='rotate' 
          label='${this.$i18n('background.color.property.rotate')}'
          min="0"
          max="360"
          step="0.01"
          units="deg"
          onchange="changeRotate" />
      </div>        


        <div class='property-item animation-property-item' style='display:none;'>
          <div class='group'>
            <span class='add-timeline-property' data-property='z-index'></span>
          </div>
          <NumberRangeEditor 
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
            <span class='add-timeline-property' data-property='opacity'></span>
          </div>
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
          <div class='group'>
            <span class='add-timeline-property' data-property='mix-blend-mode'></span>
          </div>
          <BlendSelectEditor 
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
          <SelectEditor 
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

  [EVENT('refreshRect')] () {
    const current = this.$selection.current; 
    if (current && current.is('artboard') === false) {
      const rotate = Transform.get(current.transform, 'rotateZ');

      if (rotate) {
        this.children.$rotate.setValue(rotate[0]);
      }

    }
  }

  [EVENT('changeRotate')] (key, rotate) {
    const current = this.$selection.current; 
    if (current && current.is('artboard') === false) {
      this.emit('setAttribute', {
        transform: (item) => {
          return Transform.replace(item.transform, { 
            type: 'rotateZ', value: [Length.deg(rotate)]
          })
        }
      })
    }



    this.emit('refreshRect');

  }

  refresh () {
    var current = this.$selection.current; 

    if (current) {
      this.children.$zIndex.setValue(current['z-index'] || 0)
      this.children.$opacity.setValue(current.opacity || '1')
      this.children.$mixBlend.setValue(current['mix-blend-mode'])
      this.children.$overflow.setValue(current['overflow']);
      
      const rotate = Transform.get(current.transform, 'rotateZ');

      if (rotate) {
        this.children.$rotate.setValue(rotate[0]);
      }

    }
  }


  [EVENT('changeSelect')] (key, value) {
    this.emit("setAttribute", { 
      [key]: value
    })
  }

  afterRender() {
    this.show();
  }

  [EVENT('refreshSelection')]() {
    this.refresh();
  }
}
