
import { DOMDIFF, LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";

import { Gradient } from "el/editor/property-parser/image-resource/Gradient";
import BasePopup from "el/editor/ui/popup/BasePopup";

import './GradientPickerPopup.scss';
import { createComponent } from "el/sapa/functions/jsx";
import { BackgroundImage } from "el/editor/property-parser/BackgroundImage";
import { isString } from "el/sapa/functions/func";

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
      <div class="elf--gradient-picker-popup" ref='$body' data-selected-editor=''>
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

  [LOAD('$gradientEditor') + DOMDIFF] () {
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

  [SUBSCRIBE_SELF('changeColor')] (color) {
    this.children.$g.trigger('setColorStepColor', color);
  }

  [SUBSCRIBE_SELF('changeImageUrl')] (url) {
    this.children.$g.trigger('setImageUrl', url);
  }

  updateTitle () {
    this.setTitle(this.$i18n(`gradient.picker.popup.${this.state.image.type}`))
  }

  [SUBSCRIBE("showGradientPickerPopup")](data, params, rect) {    
    data.changeEvent = data.changeEvent || 'changeFillPopup'
    data.image = data.gradient
    data.params = params;
    this.setState(data);

    this.showByRect(this.makeRect(248, 600, rect));

    this.updateTitle();

    this.emit('showGradientEditorView', {
      index: data.index
    })
  }

  [SUBSCRIBE("hideGradientPickerPopup")]() {
    this.hide();

    this.emit('hideGradientEditorView')
  }

  onClose() {
    this.emit('hideGradientEditorView')
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