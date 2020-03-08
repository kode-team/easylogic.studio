import { Layer } from "../Layer";
import icon from "../../../csseditor/ui/icon/icon";
import { ComponentManager } from "../../ComponentManager";

export class CircleLayer extends Layer {

  getIcon () {
    return icon.circle;
  }  

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'circle',
      'border-radius': '100%',
      ...obj
    });
  }

  getDefaultTitle() {
    return "Circle";
  } 


}
 
ComponentManager.registerComponent('circle', CircleLayer); 