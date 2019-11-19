import { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";
import { CLICK } from "../../../util/Event";

import { Length } from "../../../editor/unit/Length";
import GradientEditor from "../property-editor/GradientEditor";
import { BackgroundImage } from "../../../editor/css-property/BackgroundImage";
import RangeEditor from "../property-editor/RangeEditor";
import SelectEditor from "../property-editor/SelectEditor";
import BasePopup from "./BasePopup";
import EmbedColorPicker from "../property-editor/EmbedColorPicker";
import { editor } from "../../../editor/editor";


const blend_list = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity"
];

const i18n = editor.initI18n('background.image.position.popup')


export default class BackgroundImagePositionPopup extends BasePopup {

  getTitle() {
    return i18n('title')
  }

  components() {
    return {
      EmbedColorPicker,
      RangeEditor,
      SelectEditor,
      GradientEditor
    }
  }

  initState() {

    return {
      size: this.props.size || 'auto',
      repeat: this.props.repeat || 'repeat',
      x: this.props.x || Length.px(0),
      y: this.props.y || Length.px(0),
      width: this.props.width || Length.px(0),
      height: this.props.height || Length.px(0),
      blendMode: this.props.blendMode,
    }
  }

  updateData(opt = {}) {
    this.setState(opt, false);

    this.emit(this.state.changeEvent, opt, this.params);
  }

 
  templateForSize() {
    return /*html*/`
      <div class='popup-item'>
        <SelectEditor label="${i18n('size')}" ref='$size' key='size' value="${this.state.size}" options="contain,cover,auto" onchange="changeRangeEditor" />      
      </div>
    `;
  }

  [EVENT('changeRangeEditor')] (key, value) {
    this.updateData({ [key]: value });
  }

  templateForX() {
    return /*html*/`
      <div class='popup-item'>
        <RangeEditor 
            label="X"
            calc="false"            
            ref="$x" 
            key="x"
            value="${this.state.x}"
            min="-1000" max="1000" step="1"
            onchange="changeRangeEditor"
        />
      </div>
    `;
  }

  templateForY() {
    return /*html*/`
      <div class='popup-item'>
        <RangeEditor 
            label="Y" 
            calc="false"       
            ref="$y" 
            key="y"
            value="${this.state.y}"            
            min="-1000" max="1000" step="1"
            onchange="changeRangeEditor"
        />
      </div>
    `;
  }

  templateForWidth() {
    return /*html*/`
    <div class='popup-item'>
      <RangeEditor 
          label="${i18n('width')}"   
          calc="false"             
          ref="$width" 
          key="width"
          value="${this.state.width}"          
          min="0" max="500" step="1" 
          onchange="changeRangeEditor"
      />
    </div>
    `;
  }

  templateForHeight() {
    return /*html*/`
    <div class='popup-item'>
      <RangeEditor 
          label="${i18n('height')}"
          calc="false"          
          ref="$height" 
          key="height"
          value="${this.state.height}"          
          min="0" max="500" step="1" onchange="changeRangeEditor"
      />
    </div>
    `;
  }

  templateForRepeat() {
    return /*html*/`
    <div class='popup-item grid-2'>
      <label>${i18n('repeat')}</label>
      <div class='repeat-list' ref="$repeat" data-value='${this.state.repeat}'>
          <button type="button" value='no-repeat' title="${i18n('type.no-repeat')}"></button>
          <button type="button" value='repeat' title="${i18n('type.repeat')}"></button>
          <button type="button" value='repeat-x' title="${i18n('type.repeat-x')}"></button>
          <button type="button" value='repeat-y' title="${i18n('type.repeat-y')}"></button>
          <button type="button" value='space' title="${i18n('type.space')}"></button>
          <button type="button" value='round' title="${i18n('type.round')}"></button>
      </div>
    </div>
    `;
  }

  [CLICK("$repeat button")]({ $delegateTarget: $t }) {
    this.refs.$repeat.attr("data-value", $t.value);
    this.updateData({ repeat: $t.value });
  }

  templateForBlendMode() {
    return /*html*/`
    <div class='popup-item'>
      <SelectEditor label="${i18n('blend')}" ref='$blend' key='blendMode' value="${this.state.blendMode}" options="${blend_list.join(',')}" onchange="changeRangeEditor" />
    </div>
    `;
  }


  getBody() {
    return /*html*/`
      <div class="background-image-position-picker">

        <div class='box'>

          <div class='background-property'>
            ${this.templateForSize()}        
            ${this.templateForX()}
            ${this.templateForY()}
            ${this.templateForWidth()}
            ${this.templateForHeight()}
            ${this.templateForRepeat()}
            ${this.templateForBlendMode()}
          </div>
        </div>
      </div>
    `;
  }


  [EVENT("showBackgroundImagePositionPopup")](data, params) {
    data.changeEvent = data.changeEvent || 'changeFillPopup'
    // data.image = BackgroundImage.parseImage(data.image)
    this.params = params; 
    this.setState(data);

    this.show(460);
  }


}
