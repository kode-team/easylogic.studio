import { EVENT } from "../../../util/UIElement";
import BasePopup from "./BasePopup";
import EmbedColorPicker from "../property-editor/EmbedColorPicker";
import { DEBOUNCE, LOAD, CLICK } from "../../../util/Event";
import { editor } from "../../../editor/editor";

export default class ColorPickerPopup extends BasePopup {

  getTitle() {
    return editor.i18n('colorpicker.popup.title')
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

    return {
      color: 'rgba(0, 0, 0, 1)'
    }
  }


  updateData(opt = {}) {
    this.setState(opt, false);

    this.emit(this.state.changeEvent, this.state.color, this.params);
  }

 

  getBody() {
    return /*html*/`
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
      return /*html*/`
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
