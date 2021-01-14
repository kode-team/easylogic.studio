import { Layer } from "../Layer";
import icon from "@icon/icon";
import { ComponentManager } from "@manager/ComponentManager";

export class ImageLayer extends Layer {

  getIcon () {
    return icon.image;
  }  
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'image',
      name: "New Image",
      elementType: 'image',
      src: '',
      ...obj
    });
  }

  enableHasChildren() {
    return false; 
  }

  getDefaultTitle() {
    return "Image";
  }

  getIcon() {
    return icon.image;
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs('src'),
    }
  }

  resize() {
    this.reset({
      width: this.json.naturalWidth.clone(),
      height: this.json.naturalHeight.clone()
    })

  }
}
 
ComponentManager.registerComponent('image', ImageLayer);