import UIElement, { EVENT } from "../../../../util/UIElement";
import { Length } from "../../../../editor/unit/Length";
import { CHANGE_EDITOR, CHANGE_SELECTION } from "../../../types/event";
import OffsetEditor from "../shape/OffsetEditor";
import { INPUT } from "../../../../util/Event";

export default class KeyframePopup extends UIElement {

  components() {
    return {
      OffsetEditor
    }
  }

  initState() {
    return {
      name: 'none',
      offsets: []
    };
  }

  updateData(opt) {
    this.setState(opt, false); // 자동 로드를 하지 않음, state 만 업데이트
    this.emit("changeKeyframePopup", this.state);
  }

  template() {
    return `
    <div class='popup keyframe-popup' ref='$popup'>
      <div class="box">
        ${this.templateForName()}
        ${this.templateForOffset()}
      </div>
    </div>`;
  }

  templateForOffset () {
    return `<OffsetEditor />`
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
  
  // 개별 속성을 변경할 때  state 로 저장 하기 

  getOffsetData () {
    var offsets = this.state.offsets.map(it => it)

    return { offsets }
  }

  refresh() {
    this.load();

    this.refs.$name.val(this.state.name);
    this.emit('showOffsetEditor', this.getOffsetData())
  }

  [EVENT('changeOffsetEditor')] (data) {
    this.updateData(data);
  }

  [EVENT("showKeyframePopup")](data) {
    this.setState(data);

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
    "hideKeyframePopup",
    "hidePropertyPopup",
    CHANGE_EDITOR,
    CHANGE_SELECTION
  )]() {
    this.$el.hide();
  }
}
