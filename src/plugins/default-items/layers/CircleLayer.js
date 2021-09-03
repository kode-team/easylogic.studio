
import icon from "el/editor/icon/icon";
import { LayerModel } from "el/editor/model/LayerModel";


export class CircleLayer extends LayerModel {

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