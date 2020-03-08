import { LOAD, VDOM, CLICK } from "../../../util/Event";
import UIElement, { EVENT } from "../../../util/UIElement";


export default class ImageAssetPicker extends UIElement {

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

  [LOAD("$imageList") + VDOM]() {
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

  [EVENT('addImageAsset')] () {
    this.refresh();
  }
}
