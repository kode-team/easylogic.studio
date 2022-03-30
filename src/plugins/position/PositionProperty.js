import { CLICK, IF, SUBSCRIBE, SUBSCRIBE_SELF, THROTTLE } from "el/sapa/Event";
import { Transform } from "el/editor/property-parser/Transform";
import BaseProperty from "el/editor/ui/property/BaseProperty";
import { Length } from "el/editor/unit/Length";

import "./PositionProperty.scss";
import { variable } from 'el/sapa/functions/registElement';
import { createComponent } from "el/sapa/functions/jsx";

const DEFAULT_SIZE = 0;

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
      'angle',
      'transform',
      'opacity',
      'resizingVertical',
      'resizingHorizontal',
      'constraints-horizontal',
      'constriants-vertical'
    );
  }

  [SUBSCRIBE('refreshSelectionStyleView') + IF('checkChangedValue') + THROTTLE(10)]() {
    var current = this.$selection.current;

    if (!current) return '';

    this.children.$x.setValue(current.offsetX || DEFAULT_SIZE);
    this.children.$y.setValue(current.offsetY || DEFAULT_SIZE);
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
          ${createComponent('NumberInputEditor', {
            ref: '$x',
            compact: true,
            label: "X",
            key: 'x',
            min: -100000,
            max: 100000,
            trigger: "enter",
            onchange: 'changRangeEditor'
          })}
          ${createComponent('NumberInputEditor', {
            ref: '$y',
            compact: true,
            trigger: "enter",
            label: "Y",
            key: 'y',
            min: -10000,
            max: 10000,
            onchange: 'changRangeEditor'
          })}
        </div>
        <div class="grid-layout">          
          ${createComponent('NumberInputEditor', {
              ref: '$width',
              compact: true,
              trigger: "enter",
              label: 'W',
              key: 'width',
              min: 0,
              max: 3000,
              onchange: 'changRangeEditor'
          })}
          ${createComponent('NumberInputEditor', {
            ref: '$height',
            compact: true,
            trigger: "enter",
            label: 'H',
            key: 'height',
            min: 0,
            max: 3000,
            onchange: 'changRangeEditor'
          })}
        </div> 
        <div class="grid-layout">
          ${createComponent('InputRangeEditor', {
            ref: '$rotate',
            key: 'rotateZ', 
            compact: true,
            label: 'rotate_left',
            min: -360,
            max: 360,
            step: 1, 
            units: ['deg'],
            onchange: "changeRotate"
          })}
          ${createComponent('NumberInputEditor', {
            ref: '$opacity',
            key: 'opacity',
            compact: true,
            label: 'opacity',
            min: 0,
            max: 1,
            step: 0.01,
            onchange: "changeSelect"
          })}
        </div>                
      </div>
    `;
  }

  refresh() {
    const current = this.$selection.current;
    if (current) {
      this.children.$x.setValue(current.offsetX);
      this.children.$y.setValue(current.offsetY);
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

    // FIXME: key 가 width, height 일 때는 개별 transform 을 모두 적용한 상태로 맞춰야 한다. 
    // FIXME: selection tool view 에 있는 right, bottom 기능을 자체적으로 구현해야한다. 
    this.command('setAttributeForMulti', 'change position or size', this.$selection.packByValue({
      [key]: value
    }))
  }

  [SUBSCRIBE_SELF('changeRotate')](key, rotate) {
    this.command('setAttributeForMulti', "change rotate", this.$selection.packByValue({
      angle: rotate.value
    }))
  }

  [SUBSCRIBE_SELF('changeSelect')](key, value) {
    this.command("setAttributeForMulti", `change ${key}`, this.$selection.packByValue({
      [key]: value
    }))
  }



}
