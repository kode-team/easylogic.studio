import { Layer } from "../Layer";
import icon from "../../../csseditor/ui/icon/icon";
import { ComponentManager } from "../../manager/ComponentManager";

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