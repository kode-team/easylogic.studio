

import { LOAD, CLICK, DOMDIFF, SUBSCRIBE } from "el/base/Event";
import BasePopup from "el/editor/ui/popup/BasePopup";
import { Length } from "el/editor/unit/Length";


import './ImageSelectPopup.scss';
export default class ImageSelectPopup extends BasePopup {

  getTitle() {
    return 'Select a image'
  }

  getClassName() {
    return 'compact'
  }

  initState() {

    return {
      value: ''
    }
  }


  updateData(opt = {}) {
    this.setState(opt, false);

    this.state.context.trigger(this.state.changeEvent, this.state.value, {
      width: this.state.width,
      height: this.state.height,
      naturalWidth: this.state.naturalWidth,
      naturalHeight: this.state.naturalHeight      
    });
  }


  getBody() {
    return /*html*/`
      <div class="elf--image-select-popup">
        <div class='box' ref='$imageBox'>
          
        </div>
      </div>
    `;
  }

  [LOAD('$imageBox') + DOMDIFF] () {
    var project = this.$selection.currentProject || { images: [] }

    return project.images.map( (image, index) => {
      return /*html*/`<div class='image-item' ><img src='${image.local}' data-id="${image.id}" /></div>`
    })
  }

  [CLICK('$imageBox .image-item')] (e) {
    var $img = e.$dt.$('img');

    this.updateData({
      value: $img.attr('data-id'),
      naturalWidth: Length.px($img.naturalWidth),
      naturalHeight: Length.px($img.naturalHeight), 
      width: Length.px($img.naturalWidth),
      height: Length.px($img.naturalHeight)
    });

    this.trigger('hideImageSelectPopup')
  }

  [SUBSCRIBE("showImageSelectPopup")](data, params) {
    this.setState({
      context: data.context,
      changeEvent: data.changeEvent,
      value: data.value,
      params
    }, false);
    this.refresh();

    this.show(500);
  }

  [SUBSCRIBE("hideImageSelectPopup")]() {
    this.hide();
  }


}