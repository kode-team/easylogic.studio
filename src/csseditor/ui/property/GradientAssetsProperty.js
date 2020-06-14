import BaseProperty from "./BaseProperty";
import { LOAD, CLICK, DEBOUNCE, DRAGSTART } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";
import { Gradient } from "../../../editor/image-resource/Gradient";
import gradients from "../../../editor/preset/gradients";

export default class GradientAssetsProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('gradient.asset.property.title');
  }

  initState() {
    return {
      mode: 'grid',
      preset: 'linear'
    }
  }

  getTools() {

    const options = gradients.map(it => `${it.key}:${it.title}`)

    return /*html*/`
      <SelectEditor key="preset" value="${this.state.preset}" options="${options}" onchange="changePreset"  />
    `
  }  

  [EVENT('changePreset')] (key, value) {

    this.setState({
      [key]: value
    })
  }

  getClassName() {
    return 'gradient-assets-property'
  }


  [EVENT('refreshSelection') + DEBOUNCE(100)] () {
    this.show();
  }

  getBody() {
    return /*html*/`
      <div class='property-item gradient-assets'>
        <div class='gradient-list' ref='$gradientList' data-view-mode='${this.state.mode}'></div>
      </div>
    `;
  }

  [DRAGSTART('$gradientList .gradient-item')] (e) {
    const gradient = e.$dt.attr('data-gradient');
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/gradient", gradient);
  }

  [LOAD("$gradientList")]() {
    var preset = gradients.find(it => it.key === this.state.preset);

    if (!preset) {
      return '';
    }

    var results = preset.execute().map( (item, index) => { 

      return /*html*/`
        <div class='gradient-item' data-index="${index}" data-gradient='${item.gradient}' data-custom="${item.custom}">
          <div class='preview' title="${item.gradient}" draggable="true">
            <div class='gradient-view' style='background-image: ${item.gradient};'></div>
          </div>
        </div>
      `
    })

    if (preset.edit) {
      results.push(/*html*/`<div class='add-gradient-item'><butto type="button">${icon.add}</button></div>`)
    }

    return results
  }

 
  executeGradient (callback, isRefresh = true, isEmit = true ) {
    var project = this.$selection.currentProject;

    if(project) {

      callback && callback (project) 

      if (isRefresh) this.refresh();
      if (isEmit) this.emit('refreshGradientAssets');
    } else {
      alert('Please select a project.')
    }
  } 
  
  [CLICK('$gradientList .add-gradient-item')] () {

    this.executeGradient(project => {
      project.createGradient({
        gradient: Gradient.random(),
        name: '',
        variable: ''
      })
    })
  }

  [CLICK("$gradientList .preview")](e) {
    var $item = e.$dt.closest('gradient-item');    
    var gradient = $item.attr('data-gradient')

    this.emit('drop.asset', { gradient })    
  }


  [EVENT('changeGradientAssets')] (image, params) {

    this.executeGradient(project => {
      project.setGradientValue(params.index, {image});
      this.state.$el.css('background-image', image);
      this.state.$item.attr('data-gradient', image);
    }, false)              

  }
}
