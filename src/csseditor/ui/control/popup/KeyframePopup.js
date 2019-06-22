import { EVENT } from "../../../../util/UIElement";
import OffsetEditor from "../panel/property-editor/OffsetEditor";
import { INPUT } from "../../../../util/Event";
import BasePopup from "./BasePopup";

export default class KeyframePopup extends BasePopup {

  getTitle () {
    return 'Keyframe'
  }

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

  getBody() {
    return `
    <div class='keyframe-popup' ref='$popup'>
      <div class="box">
        ${this.templateForName()}
        ${this.templateForOffset()}
      </div>
    </div>`;
  }

  templateForOffset () {
    return `
      <div>
        <OffsetEditor />
      </div>
    `
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

    this.refs.$name.val(this.state.name);
    this.emit('showOffsetEditor', this.getOffsetData())
  }

  [EVENT('changeOffsetEditor')] (data) {
    this.updateData(data);
  }

  [EVENT("showKeyframePopup")](data) {
    this.setState(data);
    this.refresh()

    this.show(240);

  }

  [EVENT("hideKeyframePopup")]() {
    this.$el.hide();
  }
}
