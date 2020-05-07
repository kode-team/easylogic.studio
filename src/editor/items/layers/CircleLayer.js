import { Layer } from "../Layer";
import icon from "../../../csseditor/ui/icon/icon";
import { ComponentManager } from "../../manager/ComponentManager";

export class CircleLayer extends Layer {

  getIcon () {
    return icon.lens;
  }  

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'circle',
      name: 'New Circle',      
      'border-radius': '100%',
      ...obj
    });
  }

  getDefaultTitle() {
    return "Circle";
  } 


}
 
ComponentManager.registerComponent('circle', CircleLayer); 