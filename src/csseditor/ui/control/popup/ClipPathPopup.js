import UIElement, { EVENT } from "../../../../util/UIElement";
import { Length } from "../../../../editor/unit/Length";
import { CHANGE_SELECTION } from "../../../types/event";
import { LOAD } from "../../../../util/Event";
import { ClipPath } from "../../../../editor/css-property/ClipPath";
import CircleEditor from "../panel/property-editor/clip-path/CircleEditor";
import SelectEditor from "../panel/property-editor/SelectEditor";
import { editor } from "../../../../editor/editor";
import InsetEditor from "../panel/property-editor/clip-path/InsetEditor";
import PolygonEditor from "../panel/property-editor/clip-path/PolygonEditor";


export default class ClipPathPopup extends UIElement {

  components() {
    return {
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
    this.setState(opt, false); // 자동 로드를 하지 않음, state 만 업데이트
    this.emit("changeClipPathPopup", this.toClipPathCSS());
  }

  template() {
    return `
    <div class='popup clippath-popup' ref='$popup'>
      <div class="box">
        <div class='clip-path-editor clip-path-type' ref='$clippathType'></div>
        <div class='clip-path-editor' ref='$clippath'></div>
      </div>
    </div>`;
  }

  [LOAD('$clippathType')] () {
    return `
      <SelectEditor ref='$type' label="Type" key='type' value="${this.state.type}" options="none,circle,ellipse,inset,polygon,path,svg" onchange="changeClipPathType" />
    `
  }

  [LOAD('$clippath')] () {
    switch(this.state.type) {
    case 'circle':
      return `<CircleEditor ref='$circle' key='circle' value='${this.state.value}' onchange='changeClipPath' />`
    case 'ellipse':
      return `<CircleEditor ref='$ellipse' key='ellipse' value='${this.state.value}' onchange='changeClipPath' />`
    case 'inset':
      return `<InsetEditor ref='$inset' key='inset' value='${this.state.value}' onchange='changeClipPath' />`      
    case 'polygon':
      return `<PolygonEditor ref='$polygon' key='polygon' value='${this.state.value}' onchange='changeClipPath' />`            
    case 'path':
      return `<PathEditor ref='$path' key='path' value='${this.state.value}' onchange='changeClipPath' />`
    case 'svg':

        var current = editor.selection.current || {svg: []} 

        var options = current.svg.filter(it => it.type === 'clip-path').map(it => it.name).join(',')
        
        if (options.length) {
          options = ',' + options
        }

        return `<SelectEditor ref='$svg' key='svg' value='${this.state.value}' options='${options}' onchange='changeClipPath' />`
    default: 
      return `<div class='type none'></div>`
    }
    
  }


  [EVENT('changeClipPathType')] (key, type) {

    this.setState({
      type,
      value: ''
    })
    this.refresh();    

    this.emit("changeClipPathPopup", this.toClipPathCSS());
  }

  [EVENT('changeClipPath')] (type, value) {
    this.updateData({
      type, 
      value
    });
  }

  [EVENT("showClipPathPopup")](data) {
    this.setState(ClipPath.parseStyle(data['clip-path']));

    this.refresh();

    this.$el
      .css({
        top: Length.px(110),
        right: Length.px(320),
        bottom: Length.auto,
        'z-index': 1000000
      })
      .show("inline-block");

    this.emit("hidePropertyPopup");
  }

  [EVENT(
    "hideClipPathPopup",
    "hidePropertyPopup",
    CHANGE_SELECTION
  )]() {
    this.$el.hide();
  }
}
