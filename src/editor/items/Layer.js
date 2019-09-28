import { DomItem } from "./DomItem";
import { Length } from "../unit/Length";


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
