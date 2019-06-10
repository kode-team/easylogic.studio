import UIElement, { EVENT } from "../../../../util/UIElement";
import { CLICK, LOAD } from "../../../../util/Event";
import { Length } from "../../../../editor/unit/Length";
import { html } from "../../../../util/functions/func";
import { CHANGE_EDITOR, CHANGE_SELECTION } from "../../../types/event";
import RangeEditor from "../shape/property-editor/RangeEditor";
import SelectEditor from "../shape/property-editor/SelectEditor";

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

export default class BackgroundPropertyPopup extends UIElement {
  components() {
    return {
      RangeEditor,
      SelectEditor
    };
  }

  initState() {
    return {
      size: "auto",
      repeat: "repeat",
      x: Length.px(0),
      y: Length.px(0),
      width: Length.px(0),
      height: Length.px(0),
      maxWidth: 100,
      maxHeight: 100,
      blendMode: 'normal',
      position: {
        left: 0,
        bottom: 0
      }
    };
  }

  updateData(opt) {
    this.setState(opt, false);
    this.emit(this.data.changeEvent, opt);
  }

  templateForSize() {
    return `
      <div class='popup-item'>
        <SelectEditor label="Size" ref='$size' key='size' value="${this.state.size}" options="contain,cover,auto" onchange="changeRangeEditor" />      
      </div>
    `;
  }

  [EVENT('changeRangeEditor')] (key, value) {
    this.updateData({ [key]: value });
  }

  templateForX() {
    return `
      <div class='popup-item'>
        <RangeEditor 
            label="X"
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
    return `
      <div class='popup-item'>
        <RangeEditor 
            label="Y"        
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
    return `
    <div class='popup-item'>
      <RangeEditor 
          label="Width"      
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
    return `
    <div class='popup-item'>
      <RangeEditor 
          label="Height"
          ref="$height" 
          key="height"
          value="${this.state.height}"          
          min="0" max="500" step="1" onchange="changeRangeEditor"
      />
    </div>
    `;
  }

  templateForRepeat() {
    return `
    <div class='popup-item grid-2'>
      <label>Repeat</label>
      <div class='repeat-list' ref="$repeat" data-value='${this.state.repeat}'>
          <button type="button" value='no-repeat' title="no-repeat"></button>
          <button type="button" value='repeat' title="repeat"></button>
          <button type="button" value='repeat-x' title="repeat-x"></button>
          <button type="button" value='repeat-y' title="repeat-y"></button>
          <button type="button" value='space' title="space"></button>
          <button type="button" value='round' title="round"></button>
      </div>
    </div>
    `;
  }

  [CLICK("$repeat button")]({ $delegateTarget: $t }) {
    this.refs.$repeat.attr("data-value", $t.value);
    this.updateData({ repeat: $t.value });
  }

  templateForBlendMode() {
    return html`
    <div class='popup-item'>
      <SelectEditor label="Blend" ref='$blend' key='blend' value="${this.state.blendMode}" options="${blend_list.join(',')}" onchange="changeRangeEditor" />
    </div>
    `;
  }

  template() {
    return `
      <div class='popup background-property-popup'>
        <div class='popup-title'>Background Image</div>
        <div class='popup-content' ref='$body'>
        </div>
      </div>
    `;
  }

  [LOAD('$body')] () {
    return `
      ${this.templateForSize()}        
      ${this.templateForX()}
      ${this.templateForY()}
      ${this.templateForWidth()}
      ${this.templateForHeight()}
      ${this.templateForRepeat()}
      ${this.templateForBlendMode()}
    `
  }

  [EVENT("showBackgroundPropertyPopup")](data) {
    data.changeEvent = data.changeEvent || 'changeBackgroundPropertyPopup'

    this.data = { ... this.data , ...data } 
   
    this.setState(data);

    this.$el
      .css({
        top: Length.px(110),
        right: Length.px(10),
        bottom: Length.auto
      })
      .show("inline-block");

    // this.emit("hidePropertyPopup");
  }

  [EVENT(
    "hideBackgroundPropertyPopup",
    "hidePropertyPopup",
    CHANGE_EDITOR,
    CHANGE_SELECTION
  )]() {
    this.$el.hide();
  }
}
