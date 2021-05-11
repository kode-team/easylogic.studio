
import { LOAD, SUBSCRIBE } from "el/base/Event";
import { registElement } from "el/base/registElement";

import { Gradient } from "el/editor/property-parser/image-resource/Gradient";
import BasePopup from "./BasePopup";


import "../property-editor/EmbedColorPicker";
import "../property/ImageAssetPicker";
import "../property-editor/GradientEditor";


export default class GradientPickerPopup extends BasePopup {

  getTitle() {
    return this.$i18n('gradient.picker.popup.title')
  }

  initialize() {
    super.initialize();

    this.selectedTab = "static-gradient";
  }

  getClassName() {
    return 'fill-picker-popup';
  }

  getBody() {
    return /*html*/`
      <div class="gradient-picker" ref='$body' data-selected-editor=''>
        <div class='box'>
          <div ref='$gradientEditor'></div>
        </div>
        <div class='box'>
          <div class='colorpicker'>
            <object refClass="EmbedColorPicker" ref='$color' onchange='changeColor' />                    
          </div>
          <div class='assetpicker'>
            <object refClass="ImageAssetPicker" ref='$asset' onchange='changeImageUrl' />
          </div>
        </div>
      </div>
     
    `;
  }

  [SUBSCRIBE('changeTabType')] (type) {
    this.refs.$body.attr('data-selected-editor', type);
  }

  getColorString() {
    var value = '' ;
    if (this.state.image instanceof Gradient) {
      value = this.state.image.getColorString()
    }


    return value; 
  }

  getCurrentColor() {
    return this.state.image.colorsteps[this.state.selectColorStepIndex || 0].color; 
  }

  [LOAD('$gradientEditor')] () {
    return /*html*/`<object refClass="GradientEditor" 
      ref="$g" 
      value="${this.state.image}" 
      selectedIndex="${this.state.selectColorStepIndex}" 
      onchange='changeGradientEditor'
    />`
  }

  [SUBSCRIBE('changeGradientEditor')] (data) {

    this.state.image = data;

    this.updateData();
  }

  [SUBSCRIBE('changeColor')] (color) {
    this.children.$g.trigger('setColorStepColor', color);
  }

  [SUBSCRIBE('changeImageUrl')] (url) {
    this.children.$g.trigger('setImageUrl', url);
  }

  [SUBSCRIBE("showGradientPickerPopup")](data, params) {    
    data.changeEvent = data.changeEvent || 'changeFillPopup'
    data.image = data.gradient
    data.params = params;
    this.setState(data);

    this.show(432);
  }

  [SUBSCRIBE("selectColorStep")](color) {
    this.children.$color.setValue(color);
  }


  [SUBSCRIBE("changeColorStep")](data = {}) {

    this.state.image.reset({
      ...data
    })

    this.updateData();
  }


  updateData() {
    this.state.instance.trigger(this.state.changeEvent, this.state.image, this.state.params);
  }

}

registElement({ GradientPickerPopup })