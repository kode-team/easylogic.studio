import { CLICK, DEBOUNCE, DRAGSTART, LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import gradients from "el/editor/preset/gradients";
import { Gradient } from "el/editor/property-parser/image-resource/Gradient";
import BaseProperty from "el/editor/ui/property/BaseProperty";

import "./GradientAssetsProperty.scss";
import { variable } from 'el/sapa/functions/registElement';

const options = gradients.map(it => {
  return { value: it.key, text: it.title } 
});


export default class GradientAssetsProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('gradient.asset.property.title');
  }

  initState() {
    return {
      mode: 'grid',
      preset: 'linear',
    }
  }

  getTools() {
    return /*html*/`<div ref="$tools"></div>`
  }

  [LOAD('$tools')]() {
    return /*html*/`
      <object refClass="SelectEditor" ref='$preset'  key="preset" value="${this.state.preset}" options=${variable(options)} onchange="changePreset"  />
    `
  }  

  [SUBSCRIBE_SELF('changePreset')] (key, value) {

    this.setState({
      [key]: value
    })
  }

  getClassName() {
    return 'elf--gradient-assets-property'
  }


  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100)] () {
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
}