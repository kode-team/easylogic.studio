import { EVENT } from "../../../util/UIElement";
import BasePopup from "./BasePopup";
import EmbedColorPicker from "../property-editor/EmbedColorPicker";
import { DEBOUNCE, LOAD, CLICK } from "../../../util/Event";
import { editor } from "../../../editor/editor";

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
    return `
      <div class="color-picker-popup">
        <div class='box'>
          <EmbedColorPicker ref='$color' value='${this.state.color}' onchange='changeColor' />
        </div>
        <div class='box assets' ref='$assets'>
          <label>Assets</label>
          <div class='project-color-list' ref='$projectColors'></div>
        </div>
      </div>
    `;
  }

  [LOAD('$projectColors')] () {
    var project = editor.selection.currentProject || {colors: []};

    var colors = project.colors

    return colors.map(color => {
      return `
      <div class='color-item' title='${color.name}'>
        <div class='color-view' data-color='${color.color}' style='background-color: ${color.color}'></div>
      </div>`
    }) 
  }

  [CLICK('$projectColors .color-view')] (e) {
    this.updateData({
      color: e.$delegateTarget.attr('data-color')
    })
    this.children.$color.setValue(this.state.color);
  }


  [EVENT('refreshColorAssets') + DEBOUNCE(100)] () {
    this.load('$projectColors')
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

    if (data.hideColorAssets) {
      this.refs.$assets.hide()
    } else {
      this.refs.$assets.show()
    }
    

    this.show(232);


  }

  [EVENT("hideColorPickerPopup")]() {
    this.hide();
  }


}
