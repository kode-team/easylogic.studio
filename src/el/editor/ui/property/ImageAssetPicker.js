import { LOAD, DOMDIFF, CLICK, SUBSCRIBE } from "el/base/Event";
import { registElement } from "el/base/registElement";
import UIElement, { EVENT } from "el/base/UIElement";
import { EditorElement } from "../common/EditorElement";


export default class ImageAssetPicker extends EditorElement {

  initState() {
    return {
      mode: 'grid'
    }
  }

  template() {
    return /*html*/`
      <div class='image-asset-picker'>
        <div class='image-list' ref='$imageList' data-view-mode='${this.state.mode}'></div>
      </div>
    `;
  }

  [LOAD("$imageList") + DOMDIFF]() {
    var current = this.$selection.currentProject || { images: [] }

    var images = current.images;   
    var results = images.map( (image) => {

      return /*html*/`
        <div class='image-item'>
          <div class='preview'>
            <img src="${image.local}" />
          </div>
        </div>
      `
    })

    return results;
  }

  [CLICK('$imageList .image-item')] (e) {
    var $img = e.$dt.$('img');
    this.updateData($img.attr('src'));
  }

  updateData(localUrl) {
    this.parent.trigger(this.props.onchange, localUrl);
  }

  [SUBSCRIBE('addImageAsset')] () {
    this.refresh();
  }
}

registElement({ ImageAssetPicker })