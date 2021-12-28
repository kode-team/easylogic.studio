
import { CLICK, DEBOUNCE, DOMDIFF, LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";

import BaseProperty from "el/editor/ui/property/BaseProperty";

import './DefaultLayoutItemProperty.scss';
import { variable } from 'el/sapa/functions/registElement';
import { Constraints, ConstraintsDirection } from "el/editor/types/model";


export default class DefaultLayoutItemProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('default.layout.item.property.title.constraints');
  }

  getClassName() {
    return 'elf--default-layout-item-property';
  }

  getBody() {
    return /*html*/`
        <div class='property-item' ref='$body'>
          <div class="constraints">
            <div ref="$constraintsInfo"></div>
            <div ref="$constraintsInfoInput"></div>
          </div>
        </div>
      `;
  }  

  [LOAD('$constraintsInfo') + DOMDIFF] () {
    var current = this.$selection.current || {}

    const h = current['constraints-horizontal'] || Constraints.MIN;
    const v = current['constraints-vertical'] || Constraints.MIN;

    return /*html*/`
      <div class="constraints-box">
        <div class='item' data-value='min' data-selected="${h === Constraints.MIN || h === Constraints.STRETCH}" data-key='${ConstraintsDirection.HORIZONTAL}'></div>
        <div class='item' data-value='max' data-selected="${h === Constraints.MAX || h === Constraints.STRETCH}" data-key='${ConstraintsDirection.HORIZONTAL}'></div>
        <div class='item' data-value='center' data-selected="${h === Constraints.CENTER}" data-key='${ConstraintsDirection.HORIZONTAL}'></div>
        <div class='item' data-value='min' data-selected="${v === Constraints.MIN || v === Constraints.STRETCH}" data-key='${ConstraintsDirection.VERTICAL}'></div>
        <div class='item' data-value='max' data-selected="${v === Constraints.MAX || v === Constraints.STRETCH}" data-key='${ConstraintsDirection.VERTICAL}'></div>
        <div class='item' data-value='center' data-selected="${v === Constraints.CENTER}" data-key='${ConstraintsDirection.VERTICAL}'></div>            
        <div class="rect"></div>
      </div>
    `
  }

  [LOAD('$constraintsInfoInput')] () {
    var current = this.$selection.current || {}

    const h = current['constraints-horizontal'] || Constraints.MIN;
    const v = current['constraints-vertical'] || Constraints.MIN;    
    return /*html*/`
      <div class="has-label-grid">
        <label data-direction="horizontal"></label>
        <object refClass="SelectEditor" ${variable({
          ref: '$constraintsHorizontal',
          key: 'constraints-horizontal',
          value: current?.['constraints-horizontal'] || 'min',
          options: [
            {value: 'min', 'text': 'Left'},
            {value: 'max', 'text': 'Right'},
            {value: 'stretch', 'text': 'Left and Right'},
            {value: 'scale', 'text': 'Scale'},
            {value: 'center', 'text': 'Center'},
          ],
          onchange: 'changeConstraints'
        })} />
      </div>

      <div class="has-label-grid">
      <label data-direction="vertical"></label>
        <object refClass="SelectEditor" ${variable({
          ref: '$constraintsVertical',
          key: 'constraints-vertical',
          value: current?.['constraints-vertical'] || 'min',
          options: [
            {value: 'min', 'text': 'Top'},
            {value: 'max', 'text': 'Bottom'},
            {value: 'stretch', 'text': 'Top and Bottom'},
            {value: 'scale', 'text': 'Scale'},
            {value: 'center', 'text': 'Center'},
          ],
          onchange: 'changeConstraints'
        })} />          
      </div>
    `
  }

  [CLICK('$constraintsInfo .item')] (e) {
    const [value, key] = e.$dt.attrs('data-value', 'data-key');

    const current = this.$selection.current || {};
    const h = current['constraints-horizontal'];

    if (key === ConstraintsDirection.HORIZONTAL) {
      let newConstraints = value;

      if (h === Constraints.MAX) {
        if (e.shiftKey && value === Constraints.MIN) {
          newConstraints = Constraints.STRETCH
        }
      } else if (h === Constraints.MIN) {
        if (e.shiftKey && value === Constraints.MAX) {
          newConstraints = Constraints.STRETCH;
        }
      }

      this.trigger('changeConstraints', 'constraints-horizontal', newConstraints);

    } else if (key === ConstraintsDirection.VERTICAL) {
      let newConstraints = value;

      if (h === Constraints.MAX) {
        if (e.shiftKey && value === Constraints.MIN) {
          newConstraints = Constraints.STRETCH
        }
      } else if (h === Constraints.MIN) {
        if (e.shiftKey && value === Constraints.MAX) {
          newConstraints = Constraints.STRETCH;
        }
      }

      this.trigger('changeConstraints', 'constraints-vertical', newConstraints);
    }
  }

  [SUBSCRIBE_SELF('changeConstraints')] (key, value) {

    this.command('setAttributeForMulti', 'apply constraints', this.$selection.packByValue({
      [key]: value
    }))

    this.nextTick(() => {
      this.refresh();
    }, 100)

  }

  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShow(() => {
      var current = this.$selection.current; 
      return  current && current.isInDefault()
    });
  }
}