
import { CLICK, LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import BasePopup from "el/editor/ui/popup/BasePopup";

import { Length } from "el/editor/unit/Length";

import './BackgroundImagePositionPopup.scss';
import { variable } from 'el/sapa/functions/registElement';

export default class BackgroundImagePositionPopup extends BasePopup {

  getTitle() {
    return this.$i18n('background.image.position.popup.title')
  }

  initState() {

    return {
      size: this.props.size || 'auto',
      repeat: this.props.repeat || 'repeat',
      x: this.props.x || 0,
      y: this.props.y || 0,
      width: this.props.width || 0,
      height: this.props.height || 0,
      blendMode: this.props.blendMode,
    }
  }

  updateData(opt = {}) {
    this.setState(opt, false);

    this.emit(this.state.changeEvent, opt, this.state.params);
  }

 
  templateForSize() {
    return /*html*/`
      <div class=''>
        <object refClass="SelectEditor"  
          label="${this.$i18n('background.image.position.popup.size')}" 
          ref='$size' 
          key='size' 
          value="${this.state.size}" 
          options=${variable(["contain","cover","auto" ])}
          onchange="changeRangeEditor" />      
      </div>
    `;
  }

  [SUBSCRIBE_SELF('changeRangeEditor')] (key, value) {
    this.updateData({ [key]: value });
  }

  templateForX() {
    return /*html*/`
      <div class=''>
        <object refClass="InputRangeEditor"  
            label="X"
            compact="true"          
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
      <div class=''>
        <object refClass="InputRangeEditor"  
            label="Y" 
            compact="true"          
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
    <div class=''>
      <object refClass="InputRangeEditor"  
          label="W"
          compact="true"          
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
    <div class=''>
      <object refClass="InputRangeEditor"  
          label="H"
          compact="true"          
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
    <div class='grid'>
      <label>${this.$i18n('background.image.position.popup.repeat')}</label>
      <div class='repeat-list' ref="$repeat" data-value='${this.state.repeat}'>
          <button type="button" value='no-repeat' title="${this.$i18n('background.image.position.popup.type.no-repeat')}"></button>
          <button type="button" value='repeat' title="${this.$i18n('background.image.position.popup.type.repeat')}"></button>
          <button type="button" value='repeat-x' title="${this.$i18n('background.image.position.popup.type.repeat-x')}"></button>
          <button type="button" value='repeat-y' title="${this.$i18n('background.image.position.popup.type.repeat-y')}"></button>
          <button type="button" value='space' title="${this.$i18n('background.image.position.popup.type.space')}"></button>
          <button type="button" value='round' title="${this.$i18n('background.image.position.popup.type.round')}"></button>
      </div>
    </div>
    `;
  }

  [CLICK("$repeat button")]({ $dt: $t }) {
    this.refs.$repeat.attr("data-value", $t.value);
    this.updateData({ repeat: $t.value });
  }

  getBody() {
    return /*html*/`
      <div class="elf--background-image-position-picker" ref='$picker'></div>
    `;
  }

  [LOAD('$picker')] () {
    return /*html*/`
      
      <div class='box'>

        <div class='background-property'>
          ${this.templateForSize()}      
          <div class="grid-2">            
            ${this.templateForX()}
            ${this.templateForY()}
          </div>
          <div class="grid-2">            
            ${this.templateForWidth()}
            ${this.templateForHeight()}
          </div>
          ${this.templateForRepeat()}
        </div>
      </div>
    `
  }


  [SUBSCRIBE("showBackgroundImagePositionPopup")](data, params) {
    this.state.changeEvent = data.changeEvent || 'changeFillPopup'
    this.state.params = params; 

    this.setState(data.data);

    this.show(460);
  }


}