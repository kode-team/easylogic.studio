import { DomModel } from "./DomModel";

export class LayerModel extends DomModel {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "layer",
      name: "New Layer",
      tagName: "div",
      ...obj,
    });
  }

  getDefaultTitle() {
    return "Layer";
  }

  // toCloneObject() {
  //   return {
  //     ...super.toCloneObject(),
  //     ...this.attrs("tagName"),
  //   };
  // }
}
