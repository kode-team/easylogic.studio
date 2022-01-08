
import { LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";

import { Length } from "el/editor/unit/Length";
import BasePopup from "el/editor/ui/popup/BasePopup";

import "./PatternInfoPopup.scss";
import { createComponent } from "el/sapa/functions/jsx";

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
      units = ['deg']
    }

    return createComponent("InputRangeEditor", {  
      label,
      ref: "$x",
      key: "x",
      // compact: true,
      value: this.state.x,
      min: 0,
      max: 1000,
      step: 1,
      units,
      onchange: "changeRangeEditor"
  });
  }

  templateForY() {
    if (this.hasNotY()) return '<div></div>';            
    return createComponent("InputRangeEditor", {  
        label: "Y",
        ref: "$y",
        key: "y",
        // compact: true,
        value: this.state.y,
        min: 0,
        max: 1000,
        step: 1,
        onchange: "changeRangeEditor"
    });
  }

  templateForWidth() {
    return createComponent("InputRangeEditor"  , {
      label: this.$i18n('pattern.info.popup.width'),
      ref: "$width",
      key: "width",
      // compact: true,      
      value: this.state.width,
      min: 0,
      max: 500,
      step: 1,
      onchange: "changeRangeEditor"
});
  }

  templateForHeight() {
    return createComponent("InputRangeEditor"  , {
          label: this.$i18n('pattern.info.popup.height'),
          ref: "$height",
          // compact: true,          
          key: "height",
          value: this.state.height,
          min: 0,
          max: 500,
          step: 1,
          onchange: "changeRangeEditor"
    });
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

    if (this.hasNotLineWidth()) return '<div></div>';    

    return createComponent("InputRangeEditor", {
      label: this.$i18n('pattern.info.popup.lineWidth'),
      ref: "$lineWidth",
      key: "lineWidth",
      value: this.state.lineWidth,
      // compact: true,
      min: 0,
      max: 500,
      step: 1,
      onchange: "changeRangeEditor"
})
  }

  templateForLineHeight() {
    if (this.hasNotLineHeight()) return '<div></div>';        
    return createComponent("InputRangeEditor", {
          label: this.$i18n('pattern.info.popup.lineHeight'),
          ref: "$lineHeight",
          key: "lineHeight",
          value: this.state.lineHeight,
          // compact: true,
          min: 0,
          max: 500,
          step: 1,
          onchange: "changeRangeEditor"
    })
  }  

  templateForForeColor() {
    return createComponent("ColorViewEditor" , {
      ref: '$foreColor',
      label: this.$i18n('pattern.info.popup.foreColor'),
      key: 'foreColor',
      compact: true,      
      value: this.state.foreColor,
      onchange: "changeRangeEditor"
    })
  }

  templateForBackColor() {
    return createComponent("ColorViewEditor" , {
      ref: '$backColor',
      label: this.$i18n('pattern.info.popup.backColor'),
      key: 'backColor',
      compact: true,
      value: this.state.backColor,
      onchange: "changeRangeEditor"
    })    
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
          <div class='grid-2'>
            ${this.templateForWidth()}
            ${this.templateForHeight()}        
          </div>
          <div class='grid-2'>
            ${this.templateForLineWidth()}
            ${this.templateForLineHeight()}                  
          </div>
          <div class='grid-2'>
            ${this.templateForX()}
            ${this.templateForY()}
          </div>
          <div class="grid-2">
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

    this.show(400);
  }


}