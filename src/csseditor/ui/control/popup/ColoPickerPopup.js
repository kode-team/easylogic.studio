import { EVENT } from "../../../../util/UIElement";
import icon from "../../icon/icon";
import { html } from "../../../../util/functions/func";
import BasePopup from "./BasePopup";
import EmbedColorPicker from "../panel/property-editor/EmbedColorPicker";

export default class ColorPickerPopup extends BasePopup {

  getTitle() {
    return 'Color Picker'
  }

  getClassName() {
    return 'compact'
  }

  components() {
    return {
      EmbedColorPicker
    }
  }

  initState() {

    // 1. tab 이 바뀌면 gradient editor 는 변하지 않는다. 
    // 2. tab 이 바뀌면 기타 에디터 툴들이 재 생성된다. gradient editor 만 안 바뀐다. 
    // 3. 데이타 넘기는 방식을 다 문자열로 할 것인가? 
    // 4. 아님 모두다 객체로 넘길 것인가? 
    // 5. gradient 에디터가 제일 어려운 듯 하다. 

    return {
      color: 'rgba(0, 0, 0, 1)'
    }
  }


  updateData(opt = {}) {
    this.setState(opt, false);

    this.emit(this.state.changeEvent, this.state.color, this.params);
  }

 

  getBody() {
    return html`
      <div class="color-picker-popup">
        <div class='box'>
          <EmbedColorPicker ref='$color' value='${this.state.color}' onchange='changeColor' />
        </div>
      </div>
    `;
  }



  [EVENT('changeColor')] (color) {
    this.updateData({
      color
    })
  }

  [EVENT("showColorPickerPopup")](data, params) {
    data.changeEvent = data.changeEvent || 'changeFillPopup'
    this.params = params;
    this.setState(data, false);
    this.children.$color.setValue(this.state.color);

    this.show(232);
  }

  [EVENT("hideColorPickerPopup")]() {
    this.hide();
  }


}
