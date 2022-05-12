import icon from "elf/editor/icon/icon";
import { LayerModel } from "elf/editor/model/LayerModel";

export class ImageLayer extends LayerModel {
  getIcon() {
    return icon.image;
  }
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "image",
      name: "New Image",
      elementType: "image",
      src: "",
      ...obj,
    });
  }

  get src() {
    return this.get("src");
  }

  set src(value) {
    this.set("src", value);
  }

  get naturalWidth() {
    return this.get("naturalWidth");
  }

  set naturalWidth(value) {
    this.set("naturalWidth", value);
  }

  get naturalHeight() {
    return this.get("naturalHeight");
  }

  set naturalHeight(value) {
    this.set("naturalHeight", value);
  }

  enableHasChildren() {
    return false;
  }

  getDefaultTitle() {
    return "Image";
  }

  // toCloneObject(isDeep = true) {
  //   return {
  //     ...super.toCloneObject(isDeep),
  //     ...this.attrs("src"),
  //   };
  // }

  resize() {
    this.reset({
      width: this.naturalWidth.clone(),
      height: this.naturalHeight.clone(),
    });
  }
}
