import { CLICK, IF, SUBSCRIBE, SUBSCRIBE_SELF, THROTTLE } from "el/sapa/Event";
import { Transform } from "el/editor/property-parser/Transform";
import BaseProperty from "el/editor/ui/property/BaseProperty";
import { Length } from "el/editor/unit/Length";
import { iconUse } from 'el/editor/icon/icon';

import "./PositionProperty.scss";

const DEFAULT_SIZE = Length.z();

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

  checkChangedValue() {
    var current = this.$selection.current;
    if (!current) return false;

    return current.hasChangedField(
      'x', 
      'y', 
      'right',
      'bottom',
      'width', 
      'height', 
      'transform', 
      'rotateZ', 
      'rotate', 
      'opacity'
    );
  }

  [SUBSCRIBE('refreshSelectionStyleView') + IF('checkChangedValue') + THROTTLE(10)]() {
    var current = this.$selection.current;
    if (!current) return '';

    this.children.$x.setValue(current.x || DEFAULT_SIZE);
    this.children.$y.setValue(current.y || DEFAULT_SIZE);
    this.children.$width.setValue(current.width || DEFAULT_SIZE);
    this.children.$height.setValue(current.height || DEFAULT_SIZE);
    this.children.$opacity.setValue(current['opacity'] || '1')
    const rotateZ = Transform.get(current.transform, 'rotateZ')
    if (rotateZ) {
      this.children.$rotate.setValue(rotateZ[0]);
    } else {
      this.children.$rotate.setValue(Length.deg(0));
    }

  }

  isHideHeader() {
    return true;
  }

  getBodyClassName() {
    return 'no-padding';
  }

  getBody() {
    return /*html*/`
      <div class="position-item" ref="$positionItem" style='padding: 5px 10px;'>
        <div class="grid-layout">
          <div class='property-item' style='padding: 0px;'>
            <object refClass='NumberInputEditor' ref='$x' compact="true" label="X" key='x' min="-100000" max='100000' onchange='changRangeEditor' />
          </div>
          <div style='padding: 0px;'>
            <object refClass='NumberInputEditor' ref='$y' compact="true" label="Y" key='y' min="-10000" max='10000' onchange='changRangeEditor' />
          </div>          
        </div>
        <div class="grid-layout">
          <div >
            <object refClass='NumberInputEditor' ref='$width' compact="true"  label="${this.$i18n('position.property.width')}" key='width' min="0" max='3000' onchange='changRangeEditor' />
          </div>
          <div >
            <object refClass='NumberInputEditor' ref='$height' compact="true"  label="${this.$i18n('position.property.height')}" key='height' min="0" max='3000' onchange='changRangeEditor' />
          </div>      
        </div> 
        <div class="grid-layout">
          <div>
            <object refClass='InputRangeEditor' 
              ref='$rotate' 
              key='rotateZ' 
              compact="true" 
              label='rotate_left'
              min="-360"
              max="360"
              step="1"
              units="deg"
              onchange="changeRotate" />
          </div>        

          <div>
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

  refresh() {
    const current = this.$selection.current;
    if (current) {
      this.children.$x.setValue(current.x);
      this.children.$y.setValue(current.y);
      this.children.$width.setValue(current.width);
      this.children.$height.setValue(current.height);
      this.children.$opacity.setValue(current['opacity'] || '1')
      const rotateZ = Transform.get(current.transform, 'rotateZ')
      if (rotateZ) {
        this.children.$rotate.setValue(rotateZ[0]);
      }      
    }

  }

  [CLICK('$positionItem button[data-command]')](e) {
    const command = e.$dt.data('command');
    console.log(command)
  }


  [SUBSCRIBE_SELF('changRangeEditor')](key, value) {

    this.command('setAttributeForMulti', 'change position or size', this.$selection.packByValue({
      [key]: value
    }))

    this.nextTick(() => {
      this.emit('refreshAllElementBoundSize')
      this.emit("refreshSelectionTool", true);
    })

  }

  [SUBSCRIBE_SELF('changeRotate')](key, rotate) {
    this.command('setAttributeForMulti', "change rotate", this.$selection.packByValue({
      transform: (item) => Transform.rotateZ(item.transform, rotate)
    }))
  }

  [SUBSCRIBE_SELF('changeSelect')](key, value) {
    this.command("setAttributeForMulti", `change ${key}`, this.$selection.packByValue({
      [key]: value
    }))
  }



}
