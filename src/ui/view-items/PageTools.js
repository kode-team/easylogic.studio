import UIElement, { EVENT } from "@sapa/UIElement";

import { CLICK, PREVENT, STOP, DEBOUNCE } from "@sapa/Event";

import icon from "@icon/icon";
import "@ui/property-editor/NumberInputEditor";
import { registElement } from "@sapa/registerElement";


export default class PageTools extends UIElement {

  template() {
    return /*html*/`     
      <div class='page-tools'>
        <button type='button' ref='$minus'>${icon.remove2}</button>
        <div class='select'>
          <object refClass="NumberInputEditor"  ref='$scale' min='10' max='240' step="1" key="scale" value="${this.$viewport.scale*100}" onchange="changeRangeEditor" />
        </div>
        <label>%</label>
        <button type='button' ref='$plus'>${icon.add}</button>        
        <button type='button' ref='$center'>${icon.gps_fixed}</button>                
      </div>

    `;
  }  


  [EVENT('updateViewport')] () {
    const scale = Math.floor(this.$viewport.scale * 100)

    this.children.$scale.setValue(scale);
  }

  [EVENT('changeRangeEditor') + DEBOUNCE(1000)] (key, scale) {
    this.$viewport.setScale(scale/100);
    this.emit('updateViewport');    
    this.trigger('updateViewport');    
  }

  [CLICK('$plus') + PREVENT + STOP] () {
    const oldScale = this.$viewport.scale
    this.$viewport.setScale(oldScale + 0.01);
    this.emit('updateViewport');
    this.trigger('updateViewport');    
  }

  [CLICK('$minus') + PREVENT + STOP] () {
    const oldScale = this.$viewport.scale
    this.$viewport.setScale(oldScale - 0.01);
    this.emit('updateViewport');
    this.trigger('updateViewport');    
  }

  [CLICK('$center') + PREVENT + STOP] () {
    this.emit('moveSelectionToCenter');
  }

}

registElement({ PageTools })