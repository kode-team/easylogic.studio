import { DomItem } from "./DomItem";


export class Layer extends DomItem {
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

}
