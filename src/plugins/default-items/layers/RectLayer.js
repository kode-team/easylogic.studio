import icon from "el/editor/icon/icon";
import { Layer } from "el/editor/items/Layer";

export class RectLayer extends Layer {

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