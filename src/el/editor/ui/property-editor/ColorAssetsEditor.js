import { LOAD, CLICK, SUBSCRIBE } from "el/base/Event";
import { registElement } from "el/base/registElement";
import colors from "el/editor/preset/colors";
import { EditorElement } from "../common/EditorElement";
import "./SelectEditor";

export default class ColorAssetsEditor extends EditorElement {

  initState() {
    return {
      mode: 'grid',
      preset: 'random',
      isLoaded : false, 
      colors
    }
  }


  getTools() {
    return /*html*/`<div ref="$tools"></div>`
  }

  [LOAD('$tools')] () {
    const options = this.state.colors.map(it => `${it.key}:${it.title}`)

    return /*html*/`
      <object refClass="SelectEditor"  key="preset" value="${this.state.preset}" options="${options}" onchange="changePreset"  />
    `
  }

  [SUBSCRIBE('changePreset')] (key, value) {
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
    var preset = this.state.colors.find(it => it.key === this.state.preset);

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

registElement({ ColorAssetsEditor })