import UIElement, { EVENT } from "../../../../util/UIElement";
import { Length } from "../../../../editor/unit/Length";
import { CHANGE_EDITOR, CHANGE_SELECTION } from "../../../types/event";
import { CHANGE, LOAD } from "../../../../util/Event";
import { ClipPath } from "../../../../editor/css-property/ClipPath";
import CircleEditor from "../shape/property-editor/clip-path/CircleEditor";

export default class ClipPathPopup extends UIElement {

  components() {
    return {
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
        ${this.templateForType()}
        <div class='clip-path-editor' ref='$clippath'></div>
      </div>
    </div>`;
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
        return `<SvgEditor ref='$svg' key='svg' value='${this.state.value}' onchange='changeClipPath' />`
    default: 
      return `<div class='type none'></div>`
    }
    
  }

  templateForType() {
    return `
      <div class='type'>
        <label>Type</label>
        <div class='input grid-1'>
          <select ref='$type'>
            <option value='none' ${this.state.type === 'none' ? 'selected': ''}>none</option>
            <option value='circle' ${this.state.type === 'circle' ? 'selected': ''}>circle</option>
            <option value='ellipse' ${this.state.type === 'ellipse' ? 'selected': ''}>ellipse</option>
            <option value='inset' ${this.state.type === 'inset' ? 'selected': ''}>inset</option>
            <option value='polygon' ${this.state.type === 'polygon' ? 'selected': ''}>polygon</option>
            <option value='path' ${this.state.type === 'path' ? 'selected': ''}>path</option>
            <option value='svg' ${this.state.type === 'svg' ? 'selected': ''}>svg</option>
          </select>
        </div>
      </div>
    `
  }

  [CHANGE('$type')] (e) {

    this.setState({
      type : this.refs.$type.value,
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
        top: Length.px(150),
        left: Length.px(320),
        bottom: Length.auto,
        'z-index': 1000000
      })
      .show("inline-block");

    this.emit("hidePropertyPopup");
  }

  [EVENT(
    "hideClipPathPopup",
    "hidePropertyPopup",
    CHANGE_EDITOR,
    CHANGE_SELECTION
  )]() {
    this.$el.hide();
  }
}
