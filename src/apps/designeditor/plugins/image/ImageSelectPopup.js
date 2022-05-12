import { LOAD, CLICK, DOMDIFF, SUBSCRIBE } from "sapa";

import "./ImageSelectPopup.scss";

import BasePopup from "elf/editor/ui/popup/BasePopup";

export default class ImageSelectPopup extends BasePopup {
  getTitle() {
    return "Select a image";
  }

  getClassName() {
    return "compact";
  }

  initState() {
    return {
      value: "",
    };
  }

  updateData(opt = {}) {
    this.setState(opt, false);

    this.state.context.trigger(this.state.changeEvent, this.state.value, {
      width: this.state.width,
      height: this.state.height,
      naturalWidth: this.state.naturalWidth,
      naturalHeight: this.state.naturalHeight,
    });
  }

  getBody() {
    return /*html*/ `
      <div class="elf--image-select-popup">
        <div class='box' ref='$imageBox'>
          
        </div>
      </div>
    `;
  }

  [LOAD("$imageBox") + DOMDIFF]() {
    // var project = this.$context.selection.currentProject || { images: [] };

    return "";

    // return project.images.map( (image, index) => {
    //   return /*html*/`<div class='image-item' ><img src='${image.local}' data-id="${image.id}" /></div>`
    // })
  }

  [CLICK("$imageBox .image-item")](e) {
    var $img = e.$dt.$("img");

    this.updateData({
      value: $img.attr("data-id"),
      naturalWidth: $img.naturalWidth,
      naturalHeight: $img.naturalHeight,
      width: $img.naturalWidth,
      height: $img.naturalHeight,
    });

    this.trigger("hideImageSelectPopup");
  }

  [SUBSCRIBE("showImageSelectPopup")](data, params) {
    this.setState(
      {
        context: data.context,
        changeEvent: data.changeEvent,
        value: data.value,
        params,
      },
      false
    );
    this.refresh();

    this.show(500);
  }

  [SUBSCRIBE("hideImageSelectPopup")]() {
    this.hide();
  }
}
