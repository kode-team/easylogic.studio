
import { LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/base/Event";
import { ClipPath } from "el/editor/property-parser/ClipPath";
import BasePopup from "el/editor/ui/popup/BasePopup";

import "./editor/CircleEditor";
import "./editor/InsetEditor";
import "./editor/PolygonEditor";
import "./editor/EllipseEditor";


export default class ClipPathPopup extends BasePopup {

  getTitle() {
    return 'ClipPath'
  }

  initState() {
    return {
      type: 'none',
      value: ''
    };
  }

  toClipPathCSS () {
    return ClipPath.toCSS(this.state);
  }

  updateData(opt) {
    this.setState(opt, false); 
    this.emit(this.state.changeEvent || "changeClipPathPopup", this.toClipPathCSS());
  }

  getBody() {
    return /*html*/`
    <div class='clippath-popup' ref='$popup'>
      <div class="box">
        <div class='clip-path-editor clip-path-type' ref='$clippathType'></div>
        <div class='clip-path-editor' ref='$clippath'></div>
      </div>
    </div>`;
  }

  [LOAD('$clippathType')] () {
    return /*html*/`
      <div>${this.state.type} Editor</div>
    `
  }

  [LOAD('$clippath')] () {
    switch(this.state.type) {
    case 'circle':
      return /*html*/`<object refClass="CircleEditor" ref='$circle' key='circle' value='${this.state.value}' onchange='changeClipPath' />`
    case 'ellipse':
      return /*html*/`<object refClass="EllipseEditor" ref='$ellipse' key='ellipse' value='${this.state.value}' onchange='changeClipPath' />`
    case 'inset':
      return /*html*/`<object refClass="InsetEditor" ref='$inset' key='inset' value='${this.state.value}' onchange='changeClipPath' />`      
    case 'polygon':
      return /*html*/`<object refClass="PolygonEditor" ref='$polygon' key='polygon' value='${this.state.value}' onchange='changeClipPath' />`            
    case 'path':
      return /*html*/`<object refClass="PathEditor" ref='$path' key='path' value='${this.state.value}' onchange='changeClipPath' />`
    case 'svg':

        var current = this.$selection.currentProject || {svg: []} 

        var options = current.svg.filter(it => it.type === 'clip-path').map(it => it.name).join(',')
        
        if (options.length) {
          options = ',' + options
        }

        return /*html*/`<object refClass="SelectEditor"  ref='$svg' key='svg' value='${this.state.value}' options='${options}' onchange='changeClipPath' />`
    default: 
      return /*html*/`<div class='type none'></div>`
    }
    
  }

  [SUBSCRIBE_SELF('changeClipPath')] (type, value) {
    this.updateData({
      type, 
      value
    });
  }

  [SUBSCRIBE("showClipPathPopup")](data) {
    this.state.changeEvent = data.changeEvent;
    this.setState(ClipPath.parseStyle(data['clip-path']));

    this.refresh();

    this.show(220);
  }

  [SUBSCRIBE("hideClipPathPopup")]() {
    this.hide();
  }
}