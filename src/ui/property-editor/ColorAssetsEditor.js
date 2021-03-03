import { LOAD, CLICK } from "@core/Event";
import UIElement, { EVENT } from "@core/UIElement";
import colors from "@preset/colors";
import SelectEditor from "./SelectEditor";

export default class ColorAssetsEditor extends UIElement {

  components() {
    return {
      SelectEditor
    }
  }

  initState() {
    return {
      mode: 'grid',
      preset: 'random'
    }
  }

  getTools() {

    const options = colors.map(it => `${it.key}:${it.title}`)

    return /*html*/`
      <object refClass="SelectEditor"  key="preset" value="${this.state.preset}" options="${options}" onchange="changePreset"  />
    `
  }

  [EVENT('changePreset')] (key, value) {
    this.setState({
      [key]: value
    })
  }

  template() {
    return /*html*/`
      <div class='color-assets-editor'>
        <div class='color-assets-head'>
          <label>${this.$i18n('color.asset.property.title')}</label>
          <div class='tools'>${this.getTools()}</div>
        </div>
        <div class='color-list' ref='$colorList' data-view-mode='${this.state.mode}'></div>
      </div>
    `;
  }

  [LOAD("$colorList")]() {
    var preset = colors.find(it => it.key === this.state.preset);

    if (!preset) {
      return '';
    }

    var results = preset.execute().map( (item, index) => {

      return /*html*/`
        <div class='color-item' data-index="${index}" data-color="${item.color}">
          <div class='preview' title="${item.color}" data-index="${index}">
            <div class='color-view' style='background-color: ${item.color};'></div>
          </div>
        </div>
      `
    })

    return results
  }

  executeColor (callback, isRefresh = true, isEmit = true ) {
    var project = this.$selection.currentProject;

    if(project) {

      callback && callback (project) 

      if (isRefresh) this.refresh();
      if (isEmit) this.emit('refreshColorAssets');
    } else{
      alert('Please select a project.')
    }
  }

  [CLICK("$colorList .preview")](e) {

    const color = e.$dt.$('.color-view').css('background-color');

    this.modifyColorPicker(color);
  }

  modifyColorPicker(color) {
    this.parent.trigger(this.props.onchange, this.props.key, color, this.props.params);
  }
}
