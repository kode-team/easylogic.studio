import BaseProperty from "./BaseProperty";
import { LOAD, CLICK, DEBOUNCE, DRAGSTART } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";
import Color from "../../../util/Color";

const DEFINE_COLORS = Color.randomByCount(20).map(color => {
  return { color }
})

export default class ColorAssetsProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('color.asset.property.title');
  }

  initState() {
    return {
      mode: 'grid'
    }
  }

  getClassName() {
    return 'color-assets-property'
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)] () {
    this.show();
  }

  getBody() {
    return /*html*/`
      <div class='property-item color-assets'>
        <div class='color-list' ref='$colorList' data-view-mode='${this.state.mode}'></div>
      </div>
    `;
  }


  [DRAGSTART('$colorList .color-item')] (e) {
    const color = e.$dt.attr('data-color');
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/color", color);
  }  

  [LOAD("$colorList")]() {
    var current = this.$selection.currentProject || { colors: DEFINE_COLORS }

    var colors = current.colors;   

    var results = colors.map( (item, index) => {

      return /*html*/`
        <div class='color-item' data-index="${index}" data-color="${item.color}">
          <div class='preview' data-index="${index}" draggable="true"><div class='color-view' style='background-color: ${item.color};'></div></div>
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
  
  [CLICK('$colorList .add-color-item')] () {

    this.executeColor((project) => {
      project.createColor({
        color: Color.random(),
        name: '',
        variable: ''
      })
    })
  }

  [CLICK('$colorList .remove')] (e) {
    var $item = e.$dt.closest('color-item');
    var index = +$item.attr('data-index');

    this.executeColor(project => {
      project.removeColor(index);
    })
  }


  [CLICK('$colorList .copy')] (e) {
    var $item = e.$dt.closest('color-item');
    var index = +$item.attr('data-index');

    this.executeColor(project => {
      project.copyColor(index);
    })
  }  

  [CLICK("$colorList .preview")](e) {
    var $item = e.$dt.closest('color-item');    
    var index = +$item.attr('data-index')
    this.state.$el = e.$dt.$('.color-view');
    this.state.$color = $item.$('.color');
    var color = this.state.$el.css('background-color')

    this.emit("showColorPickerPopup", {
        hideColorAssets: true,
        target: this, 
        changeEvent: 'changeColorAssets',
        color
    }, {
        index
    });
  }


  [EVENT('changeColorAssets')] (color, params) {
      this.executeColor(project => {
        project.setColorValue(params.index, {color});      
        this.state.$el.css('background-color', color);
        this.state.$color.val(color);
      }, false)
  }
}
