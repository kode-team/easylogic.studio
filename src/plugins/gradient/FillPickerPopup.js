
import { BIND, LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";

import { Gradient } from "el/editor/property-parser/image-resource/Gradient";
import { SVGStaticGradient } from "el/editor/property-parser/image-resource/SVGStaticGradient";
import BasePopup from "el/editor/ui/popup/BasePopup";
import { isString } from "el/sapa/functions/func";
import { GradientType } from "el/editor/types/model";
import { createComponent } from "el/sapa/functions/jsx";
import { SVGFill } from "el/editor/property-parser/SVGFill";

import './GradientPickerPopup';



export default class FillPickerPopup extends BasePopup {

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
          value: GradientType.URL,
          text: "Image"
        }
      ]
    });
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

  [BIND('$body')]() {
    return {
      'data-selected-editor': this.state.image?.type
    }
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
    if (this.state.image?.type === GradientType.URL) {
      return "";
    }

    return createComponent("FillEditor", {
      ref: "$g",
      value: `${this.state.image}`,
      index: this.state.selectColorStepIndex,
      onchange: 'changeFillEditor'
    })    
  }


  [SUBSCRIBE('updateFillEditor')] (data, targetColorStep = undefined) {

    this.state.image = isString(data) ? SVGFill.parseImage(data) : data;

    if (targetColorStep) {
      this.state.selectColorStepIndex = this.state.image.colorsteps.findIndex(it => it.color === targetColorStep.color && it.percent === targetColorStep.percent);

      this.children.$color.setValue(targetColorStep.color);
    }

    this.refresh();
  }  

  [SUBSCRIBE_SELF('changeFillEditor')] (data) {

    this.state.image = isString(data) ? SVGFill.parseImage(data) : data;

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

  [SUBSCRIBE_SELF('changeImageUrl')] (url) {

    if (this.state.image) {
      this.state.image.reset({
        url
      })

      this.trigger('changeFillEditor', this.state.image);
    }
  }

  updateTitle () {
    this.children.$select.setValue(this.state.image.type);
  }

  [SUBSCRIBE("showFillPickerPopup")](data, params, rect) {
    data.changeEvent = data.changeEvent || 'changeFillPopup'
    data.params = params;

    this.showByRect(this.makeRect(248, 560, rect)); 

    this.setState(data);    

    this.updateTitle();

    if (data.image.isGradient()) {
      this.trigger('selectColorStep', data.image.colorsteps[0].color);
    }

    this.emit('showFillEditorView', {
      key: data.key,
    })
  }

  [SUBSCRIBE("hideFillPickerPopup")]() {
    this.hide();

    this.emit('hideFillEditorView')
  }

  onClose() {
    this.emit('hideFillEditorView')
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

  getValue() {
    return `${this.state.image}`;
  }

  updateData() {
    this.state.instance.trigger(this.state.changeEvent, this.getValue(), this.state.params);
  }

}