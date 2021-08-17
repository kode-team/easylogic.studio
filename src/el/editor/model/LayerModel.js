import { DomModel } from "./DomModel";
import icon from "el/editor/icon/icon";

export class LayerModel extends DomModel {

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