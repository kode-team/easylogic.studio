

import { CLICK, PREVENT, STOP, SUBSCRIBE, CONFIG } from "el/sapa/Event";
import { OBJECT_TO_CLASS } from "el/utils/func";

import icon, { iconUse } from "el/editor/icon/icon";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './PageTools.scss';

export default class PageTools extends EditorElement {

  template() {
    return /*html*/`     
      <div class='elf--page-tools'>
        <button type='button' ref='$minus'>${iconUse("remove2")}</button>
        <div class='select'>
          <object 
            refClass="NumberInputEditor" 
            ref='$scale' 
            min='10' 
            max='240' 
            step="1" 
            key="scale" 
            value="${this.$viewport.scale*100}" 
            onchange=${this.subscribe((key, scale) => {
              this.$viewport.setScale(scale/100);
              this.emit('updateViewport');    
              this.trigger('updateViewport');    
            }, 1000)}
        />
        </div>
        <label>%</label>
        <button type='button' ref='$plus'>${iconUse("add")}</button>        
        <button type='button' ref='$center' data-tooltip="Move to Center" data-direction="top">${iconUse("gps_fixed")}</button>    
        <button type='button' ref='$ruler' data-tooltip="Toggle Ruler" data-direction="top">${iconUse("straighten")}</button>    
        <button type='button' ref='$fullscreen' data-tooltip="FullScreen Canvas" data-direction="top">${iconUse("fullscreen")}</button>                        
        <button type='button' ref='$pantool' class="${OBJECT_TO_CLASS({
          on: this.$config.get('set.tool.hand')
        })}" data-tooltip="Hand | H" data-direction="top">${iconUse("pantool")}</button>   
        ${this.$injectManager.generate('page.tools')}                             
      </div>

    `;
  }  


  [SUBSCRIBE('updateViewport')] () {
    const scale = Math.floor(this.$viewport.scale * 100)

    if (this.children.$scale) {
      this.children.$scale.setValue(scale);
    }

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

  [CLICK('$pantool') + PREVENT + STOP] () {
    this.$config.toggle('set.tool.hand');
  }  

  [CLICK('$ruler') + PREVENT + STOP] () {
    this.$config.toggle('show.ruler');
  }

  [CLICK('$fullscreen') + PREVENT + STOP] () {
    this.emit('bodypanel.toggle.fullscreen');
  }

  [CONFIG('set.tool.hand')]() {
    this.refs.$pantool.toggleClass('on', this.$config.get('set.tool.hand'));
  }

}