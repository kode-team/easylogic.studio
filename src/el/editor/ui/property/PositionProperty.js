import BaseProperty from "./BaseProperty";

import { Transform } from "el/editor/property-parser/Transform";
import { registElement } from "el/base/registerElement";
import { SUBSCRIBE } from "el/base/Event";

export default class PositionProperty extends BaseProperty {
  getTitle() {
    return this.$i18n('position.property.title');
  }

  afterRender() {
    this.show();
  }

  [SUBSCRIBE('refreshSelection')]() {
    this.refreshShowIsNot(['project'])
  }

  [SUBSCRIBE('refreshRect')] () {
    var current = this.$selection.current;
    if (!current) return '';

    this.children.$x.setValue(current.x || Length.z());
    this.children.$y.setValue(current.y || Length.z());
    this.children.$width.setValue(current.width || Length.z());
    this.children.$height.setValue(current.height || Length.z());    
    this.children.$opacity.setValue(current['opacity'] || '1')
    const rotateZ = Transform.get(current.transform, 'rotateZ')
    if (rotateZ) {
      this.children.$rotate.setValue(rotateZ[0]);
    } else {
      this.children.$rotate.setValue(current.rotate);
    }

  }

  isHideHeader() {
    return true; 
  }

  getBody() {
    return /*html*/`
      <div class="position-item" ref="$positionItem" style='padding: 5px 0px;'>
        <div style='display: grid;grid-template-columns: repeat(2, 1fr); grid-column-gap: 10px;'>
          <div class='property-item animation-property-item' style='padding: 0px;'>
            <div class='group'>
              <span class='add-timeline-property' data-property='x'></span>
            </div>
            <object refClass='InputRangeEditor' ref='$x' compact="true" label="X" key='x' min="-1000" max='1000' onchange='changRangeEditor' />
          </div>
          <div class='property-item animation-property-item' style='padding: 0px;'>
            <div class='group'>
              <span class='add-timeline-property' data-property='y'></span>
            </div>
            <object refClass='InputRangeEditor' ref='$y' compact="true"  label="Y" key='y' min="-1000" max='1000' onchange='changRangeEditor' />
          </div>
        </div>
        <div style='display: grid;grid-template-columns: repeat(2, 1fr); grid-column-gap: 10px; padding-top: 10px;'>
          <div class='property-item animation-property-item' style='padding:0px'>
            <div class='group'>
              <span class='add-timeline-property' data-property='width'></span>
            </div>
            <object refClass='InputRangeEditor' ref='$width' compact="true"  label="${this.$i18n('position.property.width')}" key='width' min="0" max='3000' onchange='changRangeEditor' />
          </div>
          <div class='property-item animation-property-item' style='padding:0px'>
            <div class='group'>
              <span class='add-timeline-property' data-property='height'></span>      
            </div>
            <object refClass='InputRangeEditor' ref='$height' compact="true"  label="${this.$i18n('position.property.height')}" key='height' min="0" max='3000' onchange='changRangeEditor' />
          </div>      
        </div> 
        <div style='display: grid;grid-template-columns: repeat(2, 1fr); grid-column-gap: 10px; padding-top: 10px;'>
          <div class='property-item animation-property-item'>
            <div class='group'>
              <span class='add-timeline-property' data-property='rotate'></span>
            </div>
            <object refClass='InputRangeEditor' 
              ref='$rotate' 
              key='rotateZ' 
              compact="true" 
              label='rotate_left'
              min="0"
              max="360"
              step="0.01"
              units="deg"
              onchange="changeRotate" />
          </div>        

          <div class='property-item animation-property-item'>
            <div class='group'>
              <span class='add-timeline-property' data-property='opacity'></span>
            </div>
            <object refClass="NumberInputEditor"
              ref='$opacity' 
              key='opacity' 
              compact="true" 
              label='opacity'
              min="0"
              max="1"
              step="0.01"
              onchange="changeSelect" />
          </div>        
        </div>                
      </div>
    `;
  }

  refresh () {
    const current = this.$selection.current;
    if (current) {
      this.children.$x.setValue(current.x);
      this.children.$y.setValue(current.y);      
      this.children.$width.setValue(current.width);
      this.children.$height.setValue(current.height);         
    }

  }


  [SUBSCRIBE('changRangeEditor')] (key, value) {

    this.command('setAttribute', 'change position or size', { 
      [key]: value
    })

    this.emit('refreshAllElementBoundSize')    
  }

  [SUBSCRIBE('changeRotate')] (key, rotate) {
    this.command('setAttribute', "change rotate", { 
      rotate 
    })
  }

  [SUBSCRIBE('changeSelect')] (key, value) {
    this.command("setAttribute", `change ${key}`, { 
      [key]: value
    })
  }



}

registElement({ PositionProperty })