import icon from "el/editor/icon/icon";
import { LayerModel } from "el/editor/model/LayerModel";

export class ImageLayer extends LayerModel {

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