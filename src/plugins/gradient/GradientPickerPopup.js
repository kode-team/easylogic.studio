
import { BIND, DOMDIFF, LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";

import { Gradient } from "el/editor/property-parser/image-resource/Gradient";
import BasePopup from "el/editor/ui/popup/BasePopup";

import './GradientPickerPopup.scss';
import { createComponent } from "el/sapa/functions/jsx";
import { BackgroundImage } from "el/editor/property-parser/BackgroundImage";
import { isString } from "el/sapa/functions/func";
import { GradientType } from "el/editor/types/model";

export default class GradientPickerPopup extends BasePopup {

  getTitle() {
    return createComponent("SelectEditor", {
      ref: "$select",
      value: this.state.image?.type || GradientType.STATIC,
      onchange: "changeTabType",
      options: [
        {
          value: GradientType.STATIC,
          text: "Static"
        },
        {
          value: GradientType.LINEAR,
          text: "Linear Gradient"
        },
        {
          value: GradientType.RADIAL,
          text: "Radial Gradient"
        },
        {
          value: GradientType.CONIC,
          text: "Conic Gradient"
        },
        {
          value: GradientType.REPEATING_LINEAR,
          text: "Repeating Linear Gradient"
        },
        {
          value: GradientType.REPEATING_RADIAL,
          text: "Repeating Radial Gradient"
        },
        {
          value: GradientType.REPEATING_CONIC,
          text: "Repeating Conic Gradient"
        },
        {
          value: GradientType.URL,
          text: "Image"
        }
      ]
    });
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
      <div class="elf--gradient-picker-popup" ref='$body' data-selected-editor='${this.state.image?.type}'>
        <div class='box'>
          <div ref='$gradientEditor'></div>
        </div>
        <div class='box'>
          <div class='colorpicker'>
            ${createComponent('EmbedColorPicker', {
              ref: "$color",
              onchange: "changeColor",
            })}
          </div>
          <div class='assetpicker'>
            ${createComponent('ImageSelectEditor', {
              ref: "$image",
              key: 'image',
              value: this.state.image?.url,
              onchange: "changeImageUrl",
            })}
            ${createComponent('ImageAssetPicker', {
              ref: "$asset",
              onchange: "changeImageUrl",
            })}
          </div>
        </div>
      </div>
     
    `;
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

  [BIND('$body')] () {
    return {
      'data-selected-editor': this.state.image?.type
    }
  }

  [LOAD('$gradientEditor') + DOMDIFF] () {
    if (this.state.image?.type === GradientType.URL) {
      return "";
    }

    return createComponent("GradientEditor", {
      ref: "$g",
      value: `${this.state.image}`,
      index: this.state.selectColorStepIndex,
      onchange: 'changeGradientEditor'
    })
  }

  [SUBSCRIBE('updateGradientEditor')] (data, targetColorStep) {

    this.state.image = isString(data) ? BackgroundImage.parseImage(data) : data;

    this.state.selectColorStepIndex = this.state.image.colorsteps.findIndex(it => it.color === targetColorStep.color && it.percent === targetColorStep.percent);

    this.children.$color.setValue(targetColorStep.color);

    this.refresh();
  }

  [SUBSCRIBE_SELF('changeGradientEditor')] (data) {
    this.state.image = isString(data) ? BackgroundImage.parseImage(data) : data;

    this.updateTitle();

    this.updateData();
  }

  [SUBSCRIBE_SELF('changeTabType')] (key, type) {
    this.children.$g.trigger('changeTabType', type);
    this.refs.$body.attr('data-selected-editor', type);
  }

  [SUBSCRIBE_SELF('changeColor')] (color) {
    this.children.$g.trigger('setColorStepColor', color);
  }

  [SUBSCRIBE_SELF('changeImageUrl')] (key, url) {

    if (this.state.image) {
      this.state.image.reset({
        url
      })

      this.trigger('changeGradientEditor', this.state.image);
    }
  }

  updateTitle () {

    this.children.$select.setValue(this.state.image.type);

    // this.setTitle(this.$i18n(`gradient.picker.popup.${this.state.image.type}`))
  }

  [SUBSCRIBE("showGradientPickerPopup")](data, params, rect) {    
    data.changeEvent = data.changeEvent || 'changeFillPopup'
    data.image = data.gradient
    data.params = params;

    this.showByRect(this.makeRect(248, 560, rect));

    this.setState(data);    

    this.updateTitle();

    this.emit('showGradientEditorView', {
      index: data.index
    })
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

  load(...args) {
    if (this.$el.isShow()) {
      super.load(...args);
    }
  }

  getValue () {
    return `${this.state.image}`
  }

  updateData() {
    this.state.instance.trigger(this.state.changeEvent, this.getValue(), this.state.params);
  }

}