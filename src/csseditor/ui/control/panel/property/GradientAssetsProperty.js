import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { LOAD, CLICK, INPUT, DEBOUNCE } from "../../../../../util/Event";
import { EVENT } from "../../../../../util/UIElement";
import icon from "../../../icon/icon";
import { Gradient } from "../../../../../editor/image-resource/Gradient";
import AssetParser from "../../../../../editor/parse/AssetParser";


export default class GradientAssetsProperty extends BaseProperty {

  getTitle() {
    return "Gradient";
  }

  initState() {
    return {
      mode: 'list'
    }
  }

  getClassName() {
    return 'gradient-assets-property'
  }


  [EVENT('refreshSelection') + DEBOUNCE(100)] () {
    this.show();
  }

  getTools() {
    return `
      <div class='gradient-list-tools' ref='$tool' data-view-mode='${this.state.mode}'>
        <button type='button' data-value='list'>${icon.list} List</button>
        <button type='button' data-value='grid'>${icon.grid} Grid</button>
      </div>
    `
  }

  getBody() {
    return `
      <div class='property-item gradient-assets'>
        <div class='gradient-list' ref='$gradientList' data-view-mode='${this.state.mode}'></div>
      </div>
    `;
  }

  [CLICK('$tool button')] (e) {
    var mode = e.$delegateTarget.attr('data-value')

    this.setState({ mode }, false)

    this.refs.$tool.attr('data-view-mode', mode);
    this.refs.$gradientList.attr('data-view-mode', mode);
  }

  [LOAD("$gradientList")]() {
    var current = editor.selection.currentProject || { gradientList: [] }

    var gradients = current.gradientList;

    var results = gradients.map( (gradient, index) => {

      var objectInfo = gradient.info.objectInfo;

      return `
        <div class='gradient-item' data-index="${index}" data-gradient='${objectInfo.gradient}'>
          <div class='preview' data-index="${index}">
            <div class='gradient-view' style='background-image: ${objectInfo.gradient};'></div>
          </div>
          <div class='title'>
            <div>
              <input type='text' class='name' data-key='name' value='${objectInfo.name}' placeholder="name" />
            </div>
            <div>
              <input type='text' class='var' data-key='variable' value='${objectInfo.variable}' placeholder="--var" />
            </div>
          </div>
          <div class='tools'>
            <button type="button" class='copy'>${icon.copy}</button>          
            <button type="button" class='remove'>${icon.remove}</button>
          </div>
        </div>
      `
    })

    results.push(`<div class='add-gradient-item'><butto type="button">${icon.add}</button></div>`)

    return results
  }

 
  executeGradient (callback, isRefresh = true, isEmit = true ) {
    var project = editor.selection.currentProject;

    if(project) {

      callback && callback (project) 

      if (isRefresh) this.refresh();
      if (isEmit) this.emit('refreshGradientAssets');
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
    var $item = e.$delegateTarget.closest('gradient-item');
    var index = +$item.attr('data-index');

    this.executeGradient(project => {
      project.removeGradient(index);
    })    

  }


  [CLICK('$gradientList .copy')] (e) {
    var $item = e.$delegateTarget.closest('gradient-item');
    var index = +$item.attr('data-index');

    this.executeGradient(project => {
      project.copyGradient(index);
    })    
  }  

  [INPUT('$gradientList input')] (e) {
    var $item = e.$delegateTarget.closest('gradient-item');
    var index = +$item.attr('data-index');
    var obj = e.$delegateTarget.attrKeyValue('data-key');

    this.executeGradient(project => {
      project.setGradientValue(index, obj);      
    }, false)        
    
  }

  [CLICK("$gradientList .preview")](e) {
    var $item = e.$delegateTarget.closest('gradient-item');    
    var index = +$item.attr('data-index')
    var gradient = $item.attr('data-gradient')

    this.state.$item = $item; 
    this.state.$el = e.$delegateTarget.$('.gradient-view');

    this.emit("showGradientPickerPopup", {
        changeEvent: 'changeGradientAssets',
        gradient
    }, {
        id: this.id,
        index
    });
  }


  [EVENT('changeGradientAssets')] (gradient, params) {
    if (params.id === this.id) {
      this.executeGradient(project => {
        project.setGradientValue(params.index, {gradient});      
        this.state.$el.css('background-image', gradient);             
        this.state.$item.attr('data-gradient', gradient);        

      }, false)              

    }
  }
}
