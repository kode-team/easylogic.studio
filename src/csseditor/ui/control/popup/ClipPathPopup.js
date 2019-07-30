import { EVENT } from "../../../../util/UIElement";
import { LOAD } from "../../../../util/Event";
import { ClipPath } from "../../../../editor/css-property/ClipPath";
import CircleEditor from "../panel/property-editor/clip-path/CircleEditor";
import SelectEditor from "../panel/property-editor/SelectEditor";
import { editor } from "../../../../editor/editor";
import InsetEditor from "../panel/property-editor/clip-path/InsetEditor";
import PolygonEditor from "../panel/property-editor/clip-path/PolygonEditor";
import BasePopup from "./BasePopup";


export default class ClipPathPopup extends BasePopup {

  getTitle() {
    return 'ClipPath'
  }

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

  getBody() {
    return `
    <div class='clippath-popup' ref='$popup'>
      <div class="box">
        <div class='clip-path-editor clip-path-type' ref='$clippathType'></div>
        <div class='clip-path-editor' ref='$clippath'></div>
      </div>
    </div>`;
  }

  [LOAD('$clippathType')] () {
    return `
      <div>${this.state.type} Editor</div>
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

        var current = editor.selection.currentProject || {svg: []} 

        var options = current.svg.filter(it => it.type === 'clip-path').map(it => it.name).join(',')
        
        if (options.length) {
          options = ',' + options
        }

        return `<SelectEditor ref='$svg' key='svg' value='${this.state.value}' options='${options}' onchange='changeClipPath' />`
    default: 
      return `<div class='type none'></div>`
    }
    
  }


  // [EVENT('changeClipPathType')] (key, type) {

  //   this.setState({
  //     type,
  //     value: ''
  //   })
  //   this.refresh();    

  //   this.emit("changeClipPathPopup", this.toClipPathCSS());
  // }

  [EVENT('changeClipPath')] (type, value) {
    this.updateData({
      type, 
      value
    });
  }

  [EVENT("showClipPathPopup")](data) {
    this.setState(ClipPath.parseStyle(data['clip-path']));

    this.refresh();

    this.show(220);
  }

  [EVENT("hideClipPathPopup")]() {
    this.hide();
  }
}
