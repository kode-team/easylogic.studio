import BaseProperty from "./BaseProperty";
import { LOAD, CLICK, INPUT, DEBOUNCE } from "el/base/Event";

import icon from "el/editor/icon/icon";
import { uuidShort } from "el/base/functions/math";
import { registElement } from "el/base/registElement";


export default class SVGImageAssetsProperty extends BaseProperty {

  getTitle() {
    return "SVG Filter";
  }

  initState() {
    return {
      mode: 'list'
    }
  }

  getClassName() {
    return 'svgimage-assets-property'
  }


  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100)] () {
    this.show();
  }

  getTools() {
    return `
      <div class='svgimage-list-tools' ref='$tool' data-view-mode='${this.state.mode}'>
        <button type='button' data-value='list'>${icon.list} List</button>
        <button type='button' data-value='grid'>${icon.grid} Grid</button>
      </div>
    `
  }

  getBody() {
    return `
      <div class='property-item svgimage-assets'>
        <div class='svgimage-list' ref='$svgimageList' data-view-mode='${this.state.mode}'></div>
      </div>
    `;
  }

  [CLICK('$tool button')] (e) {
    var mode = e.$dt.attr('data-value')

    this.setState({ mode }, false)

    this.refs.$tool.attr('data-view-mode', mode);
    this.refs.$svgimageList.attr('data-view-mode', mode);
  }

  [LOAD("$svgimageList")]() {
    var current = this.$selection.currentProject || { svgimageList: [] }

    var svgimages = current.svgimages;

    var results = svgimages.map( (svgimage, index) => {

      var objectInfo = svgimage.info.objectInfo;

      return /*html*/`
        <div class='svgimage-item' data-index="${index}">
          <div class='preview' data-index="${index}">
            <div class='svgimage-view'>${objectInfo.svgimage}</div>
          </div>
          <div class='title'>
            <div>
              <input type='text' class='id' data-key='id' value='${objectInfo.id}' placeholder="id" />
            </div>
          </div>
          <div class='tools'>
            <button type="button" class='copy'>${icon.copy}</button>          
            <button type="button" class='remove'>${icon.remove}</button>
          </div>
        </div>
      `
    })

    results.push(`<div class='add-svgimage-item'><butto type="button">${icon.add}</button></div>`)

    return results
  }

 
  executeSVGImage (callback, isRefresh = true, isEmit = true ) {
    var project = this.$selection.currentProject;

    if(project) {

      callback && callback (project) 

      if (isRefresh) this.refresh();
      if (isEmit) this.emit('refreshSVGImageAssets');
    }
  } 
  
  [CLICK('$svgimageList .add-svgimage-item')] () {

    this.executeSVGImage(project => {
      project.createSVGImage({
        id: uuidShort(),
        filters: []
      })
    })
  }

  [CLICK('$svgimageList .remove')] (e) {
    var $item = e.$dt.closest('svgimage-item');
    var index = +$item.attr('data-index');

    this.executeSVGImage(project => {
      project.removeSVGImage(index);
    })    

  }

  [CLICK('$svgimageList .copy')] (e) {
    var $item = e.$dt.closest('svgimage-item');
    var index = +$item.attr('data-index');

    this.executeSVGImage(project => {
      project.copySVGImage(index);
    })    
  }  

  [INPUT('$svgimageList input')] (e) {
    var $item = e.$dt.closest('svgimage-item');
    var index = +$item.attr('data-index');
    var obj = e.$dt.attrKeyValue('data-key');

    this.executeSVGImage(project => {
      project.setSVGImageValue(index, obj);      

      this.emit('refreshSVGArea');      
    }, false)        
    
  }

}

registElement({ SVGImageAssetsProperty })