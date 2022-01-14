
import { DOMDIFF, LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";

import { Gradient } from "el/editor/property-parser/image-resource/Gradient";
import BasePopup from "el/editor/ui/popup/BasePopup";

import './GradientPickerPopup.scss';

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
    return /*html*/`<object refClass="GradientEditor" 
      ref="$g" 
      value="${this.state.image}" 
      selectedIndex="${this.state.selectColorStepIndex}" 
      onchange='changeGradientEditor'
    />`
  }

  [SUBSCRIBE_SELF('changeGradientEditor')] (data) {

    this.state.image = data;

    this.updateData();
  }

  [SUBSCRIBE_SELF('changeColor')] (color) {
    this.children.$g.trigger('setColorStepColor', color);
  }

  [SUBSCRIBE_SELF('changeImageUrl')] (url) {
    this.children.$g.trigger('setImageUrl', url);
  }

  [SUBSCRIBE("showGradientPickerPopup")](data, params, rect) {    
    data.changeEvent = data.changeEvent || 'changeFillPopup'
    data.image = data.gradient
    data.params = params;
    this.setState(data);

    this.showByRect(this.makeRect(248, 550, rect));

    this.emit('showGradientEditorView', {
      index: data.index
    })
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

  refresh() {
    if (this.$el.isShow()) {
      this.load();
    }
  }


  updateData() {
    this.state.instance.trigger(this.state.changeEvent, this.state.image, this.state.params);
  }

}