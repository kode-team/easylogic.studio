import { EVENT } from "@core/UIElement";
import { LOAD } from "@core/Event";
import { ClipPath } from "@property-parser/ClipPath";
import CircleEditor from "../property-editor/clip-path/CircleEditor";
import SelectEditor from "../property-editor/SelectEditor";

import InsetEditor from "../property-editor/clip-path/InsetEditor";
import PolygonEditor from "../property-editor/clip-path/PolygonEditor";
import BasePopup from "./BasePopup";
import EllipseEditor from "../property-editor/clip-path/EllipseEditor";



export default class ClipPathPopup extends BasePopup {

  getTitle() {
    return 'ClipPath'
  }

  components() {
    return {
      EllipseEditor,
      PolygonEditor,
      InsetEditor,
      SelectEditor,
      CircleEditor
    }
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
      return /*html*/`<span refClass="CircleEditor" ref='$circle' key='circle' value='${this.state.value}' onchange='changeClipPath' />`
    case 'ellipse':
      return /*html*/`<span refClass="EllipseEditor" ref='$ellipse' key='ellipse' value='${this.state.value}' onchange='changeClipPath' />`
    case 'inset':
      return /*html*/`<span refClass="InsetEditor" ref='$inset' key='inset' value='${this.state.value}' onchange='changeClipPath' />`      
    case 'polygon':
      return /*html*/`<span refClass="PolygonEditor" ref='$polygon' key='polygon' value='${this.state.value}' onchange='changeClipPath' />`            
    case 'path':
      return /*html*/`<span refClass="PathEditor" ref='$path' key='path' value='${this.state.value}' onchange='changeClipPath' />`
    case 'svg':

        var current = this.$selection.currentProject || {svg: []} 

        var options = current.svg.filter(it => it.type === 'clip-path').map(it => it.name).join(',')
        
        if (options.length) {
          options = ',' + options
        }

        return /*html*/`<span refClass="SelectEditor"  ref='$svg' key='svg' value='${this.state.value}' options='${options}' onchange='changeClipPath' />`
    default: 
      return /*html*/`<div class='type none'></div>`
    }
    
  }

  [EVENT('changeClipPath')] (type, value) {
    this.updateData({
      type, 
      value
    });
  }

  [EVENT("showClipPathPopup")](data) {
    this.state.changeEvent = data.changeEvent;
    this.setState(ClipPath.parseStyle(data['clip-path']));

    this.refresh();

    this.show(220);
  }

  [EVENT("hideClipPathPopup")]() {
    this.hide();
  }
}
