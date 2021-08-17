import icon from "el/editor/icon/icon";
import { LayerModel } from "el/editor/model/LayerModel";

export class RectLayer extends LayerModel {

  getIcon () {
    return icon.rect;
  }  

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'rect',
      name: 'New Rect',
      ...obj
    });
  }

  getDefaultTitle() {
    return "Rect";
  } 


}