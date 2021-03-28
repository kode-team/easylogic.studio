import { Layer } from "../Layer";
import icon from "el/editor/icon/icon";
import { ComponentManager } from "el/editor/manager/ComponentManager";

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
 
ComponentManager.registerComponent('rect', RectLayer); 