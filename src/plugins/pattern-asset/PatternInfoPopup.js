
import { LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";

import { Length } from "el/editor/unit/Length";
import BasePopup from "el/editor/ui/popup/BasePopup";

import "./PatternInfoPopup.scss";

export default class PatternInfoPopup extends BasePopup {

  getClassName() {
    return "pattern-info-popup"
  }

  getTitle() {
    return this.$i18n('pattern.info.popup.title')
  }

  initState() {

    return {
      type: this.props.type || 'grid',
      x: this.props.x || 0,
      y: this.props.y || 0,
      width: this.props.width || 0,
      height: this.props.height || 0,
      lineWidth: this.props.lineWidth || 1,
      lineHeight: this.props.lineHeight || 1,
      foreColor: this.props.foreColor || 'black',
      backColor: this.props.backColor || 'transparent',
      blendMode: this.props.blendMode || 'normal'
    }
  }

  updateData(opt = {}) {
    this.setState(opt, false);

    const { x, y, width, height, foreColor, backColor, blendMode, lineWidth, lineHeight} = this.state; 

    this.state.instance.trigger(this.state.changeEvent, {
      x, y, width, height, foreColor, backColor, blendMode, lineWidth, lineHeight
    }, this.state.params);
  }


  [SUBSCRIBE_SELF('changeRangeEditor')] (key, value) {
    this.updateData({ [key]: value });
  }

  templateForX() {
    if (this.hasNotX()) return '';      
    
    let label = 'X'
    let units = ''; 

    if (this.state.type === 'diagonal-line') {
      label = this.$i18n('pattern.info.popup.rotate')
      units = 'deg' 
    }

    return /*html*/`
      <div class=''>
        <object refClass="InputRangeEditor"  
            label="${label}"
            ref="$x" 
            key="x"
            value="${this.state.x}"
            min="0" max="1000" step="1"
            units="${units}"
            onchange="changeRangeEditor"
        />
      </div>
    `;
  }

  templateForY() {
    if (this.hasNotY()) return '';            
    return /*html*/`
      <div class=''>
        <object refClass="InputRangeEditor"  
            label="Y" 
            ref="$y" 
            key="y"
            value="${this.state.y}"            
            min="0" max="1000" step="1"
            onchange="changeRangeEditor"
        />
      </div>
    `;
  }

  templateForWidth() {

    return /*html*/`
    <div class=''>
      <object refClass="InputRangeEditor"  
          label="${this.$i18n('pattern.info.popup.width')}"   
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
          label="${this.$i18n('pattern.info.popup.height')}"
          ref="$height" 
          key="height"
          value="${this.state.height}"          
          min="0" max="500" step="1" onchange="changeRangeEditor"
      />
    </div>
    `;
  }

  hasNotLineWidth () {
    return ['check'].includes(this.state.type);
  }

  hasNotLineHeight () {
    return ['cross-dot', 'dot', 'check','diagonal-line', 'horizontal-line'].includes(this.state.type);
  }  

  hasNotX () {
    return ['grid', 'dot', 'horizontal-line'].includes(this.state.type);
  }    

  hasNotY () {
    return ['grid', 'dot', 'diagonal-line', 'vertical-line'].includes(this.state.type);
  }      

  templateForLineWidth() {

    if (this.hasNotLineWidth()) return '';    

    return /*html*/`
    <div class=''>
      <object refClass="InputRangeEditor"  
          label="${this.$i18n('pattern.info.popup.lineWidth')}"   
          ref="$lineWidth" 
          key="lineWidth"
          value="${this.state.lineWidth}"          
          min="0" max="500" step="1" 
          onchange="changeRangeEditor"
      />
    </div>
    `;
  }

  templateForLineHeight() {
    if (this.hasNotLineHeight()) return '';        
    return /*html*/`
    <div class=''>
      <object refClass="InputRangeEditor"  
          label="${this.$i18n('pattern.info.popup.lineHeight')}"
          ref="$lineHeight" 
          key="lineHeight"
          value="${this.state.lineHeight}"          
          min="0" max="500" step="1" onchange="changeRangeEditor"
      />
    </div>
    `;
  }  

  templateForForeColor() {
    return /*html*/`
      <div class=''>
        <object refClass="ColorViewEditor" 
            ref='$foreColor' 
            label="${this.$i18n('pattern.info.popup.foreColor')}" 
            key='foreColor' 
            value="${this.state.foreColor}"
            onchange="changeRangeEditor" />
      </div>
    `
  }

  templateForBackColor() {
    return /*html*/`
      <div class=''>
        <object refClass="ColorViewEditor" 
            ref='$backColor' 
            label="${this.$i18n('pattern.info.popup.backColor')}" 
            key='backColor'           
            value="${this.state.backColor}"
            onchange="changeRangeEditor" />
      </div>
    `
  }


  templateForBlendMode() {

    return /*html*/`
    <div class=''>
      <object refClass="BlendSelectEditor" 
            ref='$blend' 
            key='blendMode' 
            label="${this.$i18n('pattern.info.popup.blend')}"
            value="${this.state.blendMode}" 
            onchange="changeRangeEditor" 
        />
    </div>
    `;
}    

  getBody() {
    return /*html*/`
      <div class="background-image-position-picker" ref='$picker'></div>
    `;
  }

  [LOAD('$picker')] () {
    return /*html*/`
      
      <div class='box'>
          <div>
            ${this.templateForWidth()}
            ${this.templateForHeight()}        
          </div>
          <div>
            ${this.templateForLineWidth()}
            ${this.templateForLineHeight()}                  
          </div>
          <div>
            ${this.templateForX()}
            ${this.templateForY()}
          </div>
          <div>
            ${this.templateForForeColor()}
            ${this.templateForBackColor()}
          </div>
          <div>
            ${this.templateForBlendMode()}
          </div>
      </div>
    `
  }


  [SUBSCRIBE("showPatternInfoPopup")](data, params) {
    this.state.changeEvent = data.changeEvent || 'changePatternInfoPopup'
    this.state.params = params; 
    this.state.instance = data.instance; 

    this.setState(data.data);

    this.show(300);
  }


}