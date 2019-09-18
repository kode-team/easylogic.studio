import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { LOAD, CLICK, INPUT, DEBOUNCE, VDOM } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";
import AssetParser from "../../../editor/parse/AssetParser";


export default class ImageAssetsProperty extends BaseProperty {

  getTitle() {
    return "Image";
  }

  initState() {
    return {
      mode: 'grid'
    }
  }

  getClassName() {
    return 'image-assets-property'
  }

  [EVENT('refreshSelection') + DEBOUNCE(1000)] () {
    this.show();
    this.refresh();
  }

  getBody() {
    return /*html*/`
      <div class='property-item image-assets'>
        <div class='image-list' ref='$imageList' data-view-mode='${this.state.mode}'></div>
      </div>
    `;
  }

  [LOAD("$imageList") + VDOM]() {
    var current = editor.selection.currentProject || { images: [] }

    var images = current.images;   

    var results = images.map( (image, index) => {

      return /*html*/`
        <div class='image-item' data-index="${index}">
          <div class='preview'>
            <img src="${image.local}" />
          </div>
          <div class='title'>
            <div>
              <input type='text' class='name' data-key='name' value='${image.name}' placeholder="name" />
            </div>
          </div>
          <div class='tools'>
            <button type="button" class='copy'>${icon.copy}</button>          
            <button type="button" class='remove'>${icon.remove}</button>
          </div>
        </div>
      `
    })

    return /*html*/`
      <div class='loaded-list'>
        ${results.join('')}
      </div>
      <div class='add-image-item'>
        <input type='file' accept='image/*' ref='$file' />
        <button type="button">${icon.add}</button>
      </div>
    `
  }

  executeImage (callback, isRefresh = true, isEmit = true ) {
    var project = editor.selection.currentProject;

    if(project) {

      callback && callback (project) 

      if (isRefresh) this.refresh();
      if (isEmit) this.emit('refreshImageAssets');
    }
  }
  
  [CLICK('$imageList .add-image-item')] () {

  }

  [CLICK('$imageList .remove')] (e) {
    var $item = e.$delegateTarget.closest('image-item');
    var index = +$item.attr('data-index');

    this.executeImage(project => {
      project.removeImage(index);
    })
  }


  [CLICK('$imageList .copy')] (e) {
    var $item = e.$delegateTarget.closest('image-item');
    var index = +$item.attr('data-index');

    this.executeImage(project => {
      project.copyImage(index);
    })
  }  


  [INPUT('$imageList input')] (e) {
    var $item = e.$delegateTarget.closest('color-item');
    var index = +$item.attr('data-index');
    var obj = e.$delegateTarget.attrKeyValue('data-key');    

    this.executeColor(project => {
      project.setImageValue(index, obj);
    }, false)
  }

  [EVENT('addImageAsset')] () {
    this.refresh();
  }

}
