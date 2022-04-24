import { LOAD, CLICK, DOMDIFF, DRAGSTART, CHANGE, SUBSCRIBE } from "sapa";

import icon from "elf/editor/icon/icon";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";
import revokeObjectUrl from "elf/editor/util/revokeObjectUrl";

import "./ImageAssetsProperty.scss";
export default class ImageAssetsProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("image.asset.property.title");
  }

  initState() {
    return {
      mode: "grid",
    };
  }

  getClassNamef() {
    return "elf--image-assets-property";
  }

  afterRender() {
    this.show();
  }

  getBody() {
    return /*html*/ `
      <div class='property-item image-assets'>
        <div class='image-list' ref='$imageList' data-view-mode='${this.state.mode}'></div>
      </div>
    `;
  }

  [LOAD("$imageList") + DOMDIFF]() {
    var current = this.$selection.currentProject || { images: [] };

    var images = current.images;

    var results = images.map((image, index) => {
      return /*html*/ `
        <div class='image-item' data-index="${index}">
          <div class='preview' draggable="true">
            <img src="${image.local}" />
          </div>
          <div class='tools'>
            <button type="button" class='copy'>${icon.copy}</button>          
            <button type="button" class='remove'>${icon.remove}</button>
          </div>
        </div>
      `;
    });

    return /*html*/ `
      <div class='loaded-list'>
        ${results.join("")}
        <div class='add-image-item'>
          <input type='file' accept='image/*' ref='$file' />
          <button type="button">${icon.add}</button>
        </div>        
      </div>

    `;
  }

  executeImage(callback, isRefresh = true, isEmit = true) {
    var project = this.$selection.currentProject;

    if (project) {
      callback && callback(project);

      if (isRefresh) this.refresh();
      if (isEmit) this.emit("refreshImageAssets");
    } else {
      window.alert("Please select a project.");
    }
  }

  [DRAGSTART("$imageList .preview img")](e) {
    var index = +e.$dt.closest("image-item").attr("data-index");

    var project = this.$selection.currentProject;

    if (project) {
      var imageInfo = project.images[index];

      e.dataTransfer.setData("image/info", imageInfo.local);
    }
  }

  [CHANGE("$imageList .add-image-item input[type=file]")](e) {
    this.executeImage(() => {
      [...e.target.files].forEach((item) => {
        this.emit("updateImageAssetItem", item);
      });
    });
  }

  [CLICK("$imageList .remove")](e) {
    var $item = e.$dt.closest("image-item");
    var index = +$item.attr("data-index");

    this.executeImage((project) => {
      project.removeImage(index);
      revokeObjectUrl($item.$(".preview img").attr("src"));
    });
  }

  [CLICK("$imageList .copy")](e) {
    var $item = e.$dt.closest("image-item");
    var index = +$item.attr("data-index");

    this.executeImage((project) => {
      project.copyImage(index);
    });
  }

  [SUBSCRIBE("addImageAsset")]() {
    this.refresh();
  }
}
