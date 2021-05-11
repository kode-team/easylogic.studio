
import { LOAD, SUBSCRIBE } from "el/base/Event";

import { Gradient } from "el/editor/property-parser/image-resource/Gradient";
import BasePopup from "./BasePopup";
import "../property-editor/EmbedColorPicker";
import "../property/ImageAssetPicker";
import "../property-editor/FillEditor";
import { SVGStaticGradient } from "el/editor/property-parser/image-resource/SVGStaticGradient";
import { registElement } from "el/base/registElement";


export default class FillPickerPopup extends BasePopup {

  getTitle() {
    return this.$i18n('fill.picker.popup.title')
  }

  initState() {

    return {
      image: SVGStaticGradient.create()
    }
  }

  initialize() {
    super.initialize();

    this.selectedTab = "static-gradient";
  }

  getClassName() {
    return 'fill-picker-popup'
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
    return /*html*/`<object refClass="FillEditor" 
      ref="$g" 
      value="${this.state.image}" 
      selectedIndex="${this.state.selectColorStepIndex}" 
      onchange='changeFillEditor'
    />`
  }

  [SUBSCRIBE('changeFillEditor')] (data) {

    this.state.image = data;

    this.updateData();
  }

  [SUBSCRIBE('changeColor')] (color) {
    this.children.$g.trigger('setColorStepColor', color);
  }

  [SUBSCRIBE('changeImageUrl')] (url) {
    this.children.$g.trigger('setImageUrl', url);
  }

  [SUBSCRIBE("showFillPickerPopup")](data, params) {
    this.show(220);

    data.changeEvent = data.changeEvent || 'changeFillPopup'
    // data.image = data.gradient
    data.params = params;
    this.trigger('selectColorStep', data.image.colorsteps[0].color);
    this.setState(data);
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

registElement({ FillPickerPopup })