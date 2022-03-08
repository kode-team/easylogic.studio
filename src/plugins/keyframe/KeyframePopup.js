import { INPUT, SUBSCRIBE } from "el/sapa/Event";
import BasePopup from "el/editor/ui/popup/BasePopup";

import './KeyframePopup.scss';
import { createComponent } from "el/sapa/functions/jsx";

export default class KeyframePopup extends BasePopup {

  getTitle () {
    return this.$i18n('keyframe.popup.title')
  }

  initState() {
    return {
      name: 'none',
      offsets: []
    };
  }

  updateData(opt) {
    this.setState(opt, false); 
    this.emit("changeKeyframePopup", this.state);
  }

  getBody() {
    return /*html*/`
    <div class='elf--keyframe-popup' ref='$popup'>
      <div class="box">
        ${this.templateForName()}
        ${this.templateForOffset()}
      </div>
    </div>`;
  }

  templateForOffset () {
    return /*html*/`
      <div>
        ${createComponent("OffsetEditor",  { ref: '$offsetEditor' })}
      </div>
    `
  }

  templateForName() {
    return /*html*/`
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
  
  getOffsetData () {
    var offsets = this.state.offsets.map(it => it)

    return { offsets }
  }

  refresh() {

    this.refs.$name.val(this.state.name);
    this.emit('showOffsetEditor', this.getOffsetData())
  }

  [SUBSCRIBE('changeOffsetEditor')] (data) {
    this.updateData(data);
  }

  [SUBSCRIBE("showKeyframePopup")](data) {
    this.setState(data);
    this.refresh();

    this.show(240);

  }

  [SUBSCRIBE("hideKeyframePopup")]() {
    this.$el.hide();
  }
}