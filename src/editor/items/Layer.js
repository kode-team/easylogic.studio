import { DomItem } from "./DomItem";
import { Length } from "../unit/Length";
import icon from "../../csseditor/ui/icon/icon";
import { ComponentManager } from "../ComponentManager";


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
      tagName: this.json.tagName
    }
  }


  get screenX () { 
    if (this.json.parent) {
        return Length.px( this.json.parent.screenX.value + (this.json.x || zero).value )
    }

    return this.json.x || Length.px(0) 
  }
  get screenY () { 

      if (this.json.parent) {
          return Length.px( this.json.parent.screenY.value + (this.json.y || zero).value )
      }

      return this.json.y || Length.px(0) 
  }  

}

ComponentManager.registerComponent('layer', Layer);