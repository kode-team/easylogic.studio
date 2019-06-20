import UIElement, { EVENT } from "../../../../util/UIElement";
import { Length } from "../../../../editor/unit/Length";
import { CHANGE_SELECTION } from "../../../types/event";
import { INPUT, LOAD } from "../../../../util/Event";
import SVGFilterEditor from "../panel/property-editor/SVGFilterEditor";
import SVGClipPathEditor from "../panel/property-editor/SVGClipPathEditor";

export default class SVGPropertyPopup extends UIElement {

  components() {
    return {
      SVGFilterEditor,
      SVGClipPathEditor
    }
  }

  initState() {
    return {
      changeEvent: 'changeSVGPropertyPopup',
      name: '',
      type: '',
      value: []
    };
  }

  updateData(opt) {
    this.setState(opt, false); // 자동 로드를 하지 않음, state 만 업데이트
    this.emit(this.state.changeEvent, this.state);
  }

  template() {
    return `
    <div class='popup svg-property-editor-popup' ref='$popup'>
      <div class="box">
        ${this.templateForName()}
        <div class='editor' ref='$editor'></div>
      </div>
    </div>`;
  }

  [LOAD('$editor')] () {

    switch(this.state.type) {
      case 'filter':
        return `
          <SVGFilterEditor ref='$filter' title="SVG Filter" key="filter" onchange='changeFilterEditor'>
            <property name="value" type="json">${JSON.stringify(this.state.value)}</property>
          </SVGFilterEditor>
        `
      case 'clip-path':
        return `
          <SVGClipPathEditor ref='$clippath' title="SVG Clip Path" key="clip-path" onchange='changeClipPathEditor'>
            <property name="value" type='json'>${JSON.stringify(this.state.value)}</property>
          </SVGClipPathEditor>
        `
    }

    return ``
  }

  [EVENT('changeFilterEditor')] (key, value) {
    this.updateData({
      value
    })
  }

  [EVENT('changeClipPathEditor')] (key, value) {
    this.updateData({
      value
    })
  }  

  templateForName() {
    return `
      <div class='name'>
        <label>Name</label>
        <div class='input grid-1'>
          <input type='text' value='${this.state.name}' ref='$name'/>
        </div>
      </div>
    `
  }

  [INPUT('$name')] (e) {
    if (this.refs.$name.value.match(/^[a-zA-Z0-9\b]+$/)) {
      this.updateData({name : this.refs.$name.value })
    } else {
      e.preventDefault()
      e.stopPropagation()
      return false;
    }
  }

  refresh() {
    this.refs.$name.val(this.state.name);

    this.load();
  }

  [EVENT("showSVGPropertyPopup")](data) {
    this.setState(data);
    this.refresh()

    this.$el
      .css({
        top: Length.px(150),
        right: Length.px(320),
        bottom: Length.auto,
        'z-index': 1000000
      })
      .show("inline-block");

    this.emit("hidePropertyPopup");
  }

  [EVENT(
    "hideSVGPropertyPopup",
    "hidePropertyPopup",
    CHANGE_SELECTION
  )]() {
    this.$el.hide();
  }
}
