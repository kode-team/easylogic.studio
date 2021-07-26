
import icon from "el/editor/icon/icon";
import { Layer } from "el/editor/items/Layer";

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


  editable(editablePropertyName) {

    switch (editablePropertyName) {
      case "font":
      case "font-spacing":
      case "text-style":
      case "text-shadow":
      case "text-fill":
      case 'text-clip':
      case 'background-image':
      case 'box-model':
        return true;
      case 'svg-item':
      case 'border':
      case 'border-radius':
      case 'backdrop-filter':
      case 'background-image':
      case 'pattern':
      case 'box-shadow':
      case 'transform':
      case 'transform-origin':
      case 'perspective':
      case 'perspective-origin':
        return false;
    }

    return super.editable(editablePropertyName);
  }
}