
import {
  LOAD, CLICK, SUBSCRIBE, SUBSCRIBE_SELF, IF
} from "el/sapa/Event";

import BaseProperty from "el/editor/ui/property/BaseProperty";
import { createComponent } from 'el/sapa/functions/jsx';

import './BackgroundImageProperty.scss';

export default class BackgroundImageProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('background.image.property.title');
  }


  afterRender() {
    this.show();
  }

  getClassName() {
    return 'background-image'
  }

  getBodyClassName() {
    return 'no-padding';
  }

  getBody() {
    return /*html*/`
      <div class='full' ref='$property'></div>               
    `;
  }


  getTools() {
    return /*html*/`
      <div class="fill-sample-list" ref='$add'>
        <button type="button" class='fill' data-value="static-gradient" data-tooltip="Static" ></button>
        <button type="button" class='fill' data-value="linear-gradient" data-tooltip="Linear" ></button>
        <button type="button" class='fill' data-value="repeating-linear-gradient" data-tooltip="R Linear" ></button>
        <button type="button" class='fill' data-value="radial-gradient" data-tooltip="Radial" ></button>
        <button type="button" class='fill' data-value="repeating-radial-gradient" data-tooltip="R Radial" ></button>
        <button type="button" class='fill' data-value="conic-gradient" data-tooltip="Conic" ></button>
        <button type="button" class='fill' data-value="repeating-conic-gradient" data-tooltip="R Conic" data-direction="bottom right" ></button>
      </div>
    `
  }

  [CLICK('$add [data-value]')](e) {
    this.children.$backgroundImageEditor.trigger('add', e.$dt.data('value'));
  }

  [LOAD('$property')]() {
    var current = this.$selection.current || {};
    var value = current['background-image'] || ''

    return createComponent('BackgroundImageEditor', {
      ref: '$backgroundImageEditor',
      key: 'background-image',
      value,
      onchange: 'changeBackgroundImage'
    });
  }

  get editableProperty() {
    return 'background-image';
  }

  [SUBSCRIBE('refreshSelection') + IF('checkShow')]() {
    this.refresh();
  }


  [SUBSCRIBE("refreshSelectionStyleView")]() {
    if (this.$selection.current) {
      if (this.$selection.hasChangedField("background-image")) {
        this.refresh();
      }
    }
  }

  [SUBSCRIBE_SELF('changeBackgroundImage')](key, value) {
    this.nextTick(() => {
      this.command('setAttributeForMulti', 'change background image', this.$selection.packByValue({
        [key]: value
      }))
    }, 10)

  }

}