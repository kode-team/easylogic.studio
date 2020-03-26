import BaseProperty from "./BaseProperty";
import { LOAD, CLICK, INPUT, DEBOUNCE, DRAGSTART, DRAG } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";
import { Gradient } from "../../../editor/image-resource/Gradient";


export default class GradientAssetsProperty extends BaseProperty {

  getTitle() {
    return "Gradient";
  }

  initState() {
    return {
      mode: 'grid'
    }
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

  [DRAGSTART('$gradientList .preview')] (e) {
    const index = e.$dt.attr('data-index');

    var project = this.$selection.currentProject;

    if(project) {
      const gradient = project.getGradientIndex(+index);
      e.dataTransfer.effectAllowed = "copy";
      e.dataTransfer.setData("text/gradient", gradient.gradient);
    }
  }

  [LOAD("$gradientList")]() {
    var current = this.$selection.currentProject || { gradients: [] }

    var gradients = current.gradients;

    var results = gradients.map( (item, index) => { 

      return /*html*/`
        <div class='gradient-item' data-index="${index}" data-gradient='${item.gradient}'>
          <div class='preview' data-index="${index}"  draggable="true">
            <div class='gradient-view' style='background-image: ${item.gradient};'></div>
          </div>
          <div class='title'>
           <!-- <div>
              <input type='text' class='value' data-key='value' value='${item.gradient}' placeholder="name" />
            </div>          
            <div>
              <input type='text' class='name' data-key='name' value='${item.name}' placeholder="name" />
            </div>
            <div>
              <input type='text' class='var' data-key='variable' value='${item.variable}' placeholder="--var" />
            </div> -->
          </div>
          <div class='tools'>
            <button type="button" class='copy'>${icon.copy}</button>          
            <button type="button" class='remove'>${icon.remove}</button>
          </div>
        </div>
      `
    })

    results.push(/*html*/`<div class='add-gradient-item'><butto type="button">${icon.add}</button></div>`)

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

  [CLICK('$gradientList .remove')] (e) {
    var $item = e.$dt.closest('gradient-item');
    var index = +$item.attr('data-index');

    this.executeGradient(project => {
      project.removeGradient(index);
    })    

  }


  [CLICK('$gradientList .copy')] (e) {
    var $item = e.$dt.closest('gradient-item');
    var index = +$item.attr('data-index');

    this.executeGradient(project => {
      project.copyGradient(index);
    })    
  }  

  [INPUT('$gradientList input')] (e) {
    var $item = e.$dt.closest('gradient-item');
    var index = +$item.attr('data-index');
    var obj = e.$dt.attrKeyValue('data-key');

    this.executeGradient(project => {
      project.setGradientValue(index, obj);      
    }, false)        
    
  }

  [CLICK("$gradientList .preview")](e) {
    var $item = e.$dt.closest('gradient-item');    
    var index = +$item.attr('data-index')
    var gradient = $item.attr('data-gradient')

    this.state.$item = $item; 
    this.state.$el = e.$dt.$('.gradient-view');
    this.state.$value = $item.$("[data-key='value']")

    this.emit("showGradientPickerPopup", {
      instance: this,
      changeEvent: 'changeGradientAssets',
      gradient
    }, { index });
  }


  [EVENT('changeGradientAssets')] (image, params) {

    this.executeGradient(project => {
      project.setGradientValue(params.index, {image});
      this.state.$el.css('background-image', image);
      this.state.$item.attr('data-gradient', image);
      this.state.$value.val(image)
    }, false)              

  }
}
