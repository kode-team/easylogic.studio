import { DomItem } from "./DomItem";
import icon from "@icon/icon";

export class Layer extends DomItem {

  static getIcon () {
    return icon.rect;
  }

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "layer",
      name: "New Layer",
      tagName: 'div',
      ...obj
    });
  }

  getDefaultTitle() {
    return "Layer";
  } 

  getIcon() {
    return icon.rect;
  }


  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs('tagName'),
    }
  }

}