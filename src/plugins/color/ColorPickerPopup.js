import UIElement from "el/sapa/UIElement";
import { LOAD, CLICK, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import BasePopup from "el/editor/ui/popup/BasePopup";

import './ColorPickerPopup.scss';
export default class ColorPickerPopup extends BasePopup {

  getTitle() {
    return this.$i18n('colorpicker.popup.title')
  }

  getClassName() {
    return 'compact elf--colorpicker-popup'
  }

  initState() {

    return {
      color: 'rgba(0, 0, 0, 1)'
    }
  }


  updateData(opt = {}) {
    this.setState(opt, false);

    if (this.state.target) {
      this.state.target.trigger(this.state.changeEvent, this.state.color, this.params);
    }

  }

  updateEndData(opt = {}) {
    this.setState(opt, false);

    if (this.state.target) {
      this.state.target.trigger(this.state.changeEndEvent, this.state.color, this.params);
    }

  }

  getBody() {
    return /*html*/`
    <div>
      <div class='box'>
        <object 
          refClass="EmbedColorPicker" 
          ref='$color' 
          value='${this.state.color}' 
          onchange=${this.subscribe((color) => this.updateData({ color }))} 
          onchangeend=${this.subscribe((color) => this.updateEndData({ color }))} />
      </div>
    </div>
  `;
  }

  [LOAD('$projectColors')] () {
    var project = this.$selection.currentProject || {colors: []};

    var colors = project.colors

    return colors.map(color => {
      return /*html*/`
      <div class='color-item' title='${color.name}'>
        <div class='color-view' data-color='${color.color}' style='background-color: ${color.color}'></div>
      </div>`
    }) 
  }

  [CLICK('$projectColors .color-view')] (e) {
    this.updateData({
      color: e.$dt.attr('data-color')
    })
    this.children.$color.setValue(this.state.color);
  }

  [SUBSCRIBE("showColorPickerPopup")](data, params, rect) {
    data.changeEvent = data.changeEvent || 'changeFillPopup'

    if (!(data.target instanceof UIElement)) {
      throw new Error('ColorPicker needs data.target');
    }

    this.params = params;
    this.setState(data, false);
    this.children.$color.setValue(this.state.color);

    this.showByRect(this.makeRect(245, 500, rect));
  }

  [SUBSCRIBE("hideColorPickerPopup")]() {
    this.hide();
  }


}