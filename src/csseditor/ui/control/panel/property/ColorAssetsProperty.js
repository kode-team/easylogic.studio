import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { LOAD, BIND, CLICK, INPUT } from "../../../../../util/Event";
import { EVENT } from "../../../../../util/UIElement";
import icon from "../../../icon/icon";
import Color from "../../../../../util/Color";


export default class ColorAssetsProperty extends BaseProperty {

  getTitle() {
    return "Color";
  }

  initState() {
    return {
      mode: 'list'
    }
  }

  getClassName() {
    return 'color-assets-property'
  }

  getBody() {
    return `
      <div class='property-item color-assets'>
        <div class='color-list-tools' ref='$tool' data-view-mode='${this.state.mode}'>
          <button type='button' data-value='list'>${icon.list} List</button>
          <button type='button' data-value='grid'>${icon.grid} Grid</button>
        </div>
        <div class='color-list' ref='$colorList' data-view-mode='${this.state.mode}'></div>
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
    this.refs.$colorList.attr('data-view-mode', mode);
  }

  [LOAD("$colorList")]() {
    var current = editor.selection.currentProject || { colors: [] }

    var results = current.colors.map( (color, index) => {
      return `
        <div class='color-item' data-index="${index}">
          <div class='preview' data-index="${index}"><div class='color-view' style='background-color: ${color.color};'></div></div>
          <div class='title'>
            <div>
              <input type='text' class='name' data-key='name' value='${color.name}' placeholder="name" />
            </div>
            <div>
              <input type='text' class='var' data-key='variable' value='${color.variable}' placeholder="--var" />
            </div>
          </div>
          <div class='tools'>
            <button type="button" class='copy'>${icon.copy}</button>          
            <button type="button" class='remove'>${icon.remove}</button>
          </div>
        </div>
      `
    })

    results.push(`<div class='add-color-item'><butto type="button">${icon.add}</button></div>`)

    return results
  }
  
  [CLICK('$colorList .add-color-item')] () {
    var project = editor.selection.currentProject;

    if(project) {
      project.createColor({
        color: Color.random(),
        name: '',
        variable: ''
      })

      this.refresh();
      this.emit('refreshColorAssets');
    }
  }

  [CLICK('$colorList .remove')] (e) {
    var $item = e.$delegateTarget.closest('color-item');
    var index = +$item.attr('data-index');

    var project = editor.selection.currentProject;
    if (project) {
      project.removeColor(index);

      this.refresh();
      this.emit('refreshColorAssets');
    }
  }


  [CLICK('$colorList .copy')] (e) {
    var $item = e.$delegateTarget.closest('color-item');
    var index = +$item.attr('data-index');

    var project = editor.selection.currentProject;
    if (project) {
      project.copyColor(index);

      this.refresh();
      this.emit('refreshColorAssets');
    }
  }  

  [INPUT('$colorList input')] (e) {
    var $item = e.$delegateTarget.closest('color-item');
    var index = +$item.attr('data-index');
    
    var project = editor.selection.currentProject;

    if(project) {
      var obj = e.$delegateTarget.attrKeyValue('data-key');

      project.setColorValue(index, obj);      

      this.emit('refreshColorAssets');
    }
  }

  [CLICK("$colorList .preview")](e) {
    var $item = e.$delegateTarget.closest('color-item');    
    var index = +$item.attr('data-index')
    this.state.$el = e.$delegateTarget.$('.color-view');
    var color = this.state.$el.css('background-color')

    this.emit("showColorPickerPopup", {
        changeEvent: 'changeColorAssets',
        color
    }, {
        id: this.id,
        index
    });
  }


  [EVENT('changeColorAssets')] (color, params) {
    if (params.id === this.id) {
      var project = editor.selection.currentProject;

      if(project) {
        project.setColorValue(params.index, {color});      
        this.state.$el.css('background-color', color);        
        this.emit('refreshColorAssets');        
      }
    }
  }
}
