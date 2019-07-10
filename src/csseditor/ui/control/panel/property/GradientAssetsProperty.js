import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { LOAD, CLICK, INPUT } from "../../../../../util/Event";
import { EVENT } from "../../../../../util/UIElement";
import icon from "../../../icon/icon";
import { Gradient } from "../../../../../editor/image-resource/Gradient";


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

  getBody() {
    return `
      <div class='property-item gradient-assets'>
        <div class='gradient-list-tools' ref='$tool' data-view-mode='${this.state.mode}'>
          <button type='button' data-value='list'>${icon.list} List</button>
          <button type='button' data-value='grid'>${icon.grid} Grid</button>
        </div>
        <div class='gradient-list' ref='$gradientList' data-view-mode='${this.state.mode}'></div>
      </div>
    `;
  }

  isHideHeader() {
    return true; 
  }

  [CLICK('$tool button')] (e) {
    var mode = e.$delegateTarget.attr('data-value')

    this.setState({ mode }, false)

    this.refs.$tool.attr('data-view-mode', mode);
    this.refs.$gradientList.attr('data-view-mode', mode);
  }

  [LOAD("$gradientList")]() {
    var current = editor.selection.currentProject || { gradients: [] }

    var results = current.gradients.map( (gradient, index) => {
      return `
        <div class='gradient-item' data-index="${index}">
          <div class='preview' data-index="${index}">
            <div class='gradient-view' style='background-image: ${gradient.gradient};'></div>
          </div>
          <div class='title'>
            <div>
              <input type='text' class='name' data-key='name' value='${gradient.name}' placeholder="name" />
            </div>
            <div>
              <input type='text' class='var' data-key='variable' value='${gradient.variable}' placeholder="--var" />
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
  
  [CLICK('$gradientList .add-gradient-item')] () {
    var project = editor.selection.currentProject;

    if(project) {
      project.createGradient({
        gradient: Gradient.random(),
        name: '',
        variable: ''
      })

      this.refresh();
      this.emit('refreshGradientAssets');
    }
  }

  [CLICK('$gradientList .remove')] (e) {
    var $item = e.$delegateTarget.closest('gradient-item');
    var index = +$item.attr('data-index');

    var project = editor.selection.currentProject;
    if (project) {
      project.removeGradient(index);

      this.refresh();
      this.emit('refreshGradientAssets');
    }
  }


  [CLICK('$gradientList .copy')] (e) {
    var $item = e.$delegateTarget.closest('gradient-item');
    var index = +$item.attr('data-index');

    var project = editor.selection.currentProject;
    if (project) {
      project.copyGradient(index);

      this.refresh();
      this.emit('refreshGradientAssets');
    }
  }  

  [INPUT('$gradientList input')] (e) {
    var $item = e.$delegateTarget.closest('gradient-item');
    var index = +$item.attr('data-index');
    
    var project = editor.selection.currentProject;

    if(project) {
      var obj = e.$delegateTarget.attrKeyValue('data-key');

      project.setGradientValue(index, obj);      

      this.emit('refreshGradientAssets');
    }
  }

  [CLICK("$gradientList .preview")](e) {
    var $item = e.$delegateTarget.closest('gradient-item');    
    var index = +$item.attr('data-index')
    this.state.$el = e.$delegateTarget.$('.gradient-view');
    var project = editor.selection.currentProject;
    var gradient = project.gradients[index].gradient

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
      var project = editor.selection.currentProject;

      if(project) {
        project.setGradientValue(params.index, {gradient});      
        this.state.$el.css('background-image', gradient);        
        this.emit('refreshGradientAssets');        
      }
    }
  }
}
