import { Layer } from "../Layer";
import icon from "el/editor/icon/icon";
import { ComponentManager } from "el/editor/manager/ComponentManager";

export class TextLayer extends Layer {

  getIcon () {
    return icon.title;
  }  
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'text',
      name: "New Text",
      elementType: 'p',
      content: '',
      ...obj
    });
  }
  enableHasChildren() {
    return false; 
  }

  getDefaultTitle() {
    return "Text";
  } 

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs('content'),
    }
  }
}
 
ComponentManager.registerComponent('text', TextLayer); 