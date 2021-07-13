
import icon from "el/editor/icon/icon";
import { Layer } from "el/editor/items/Layer";


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