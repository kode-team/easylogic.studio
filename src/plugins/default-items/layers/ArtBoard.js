import { Length } from "el/editor/unit/Length";
import icon from "el/editor/icon/icon";
import { DomItem } from "el/editor/items/DomItem";

export class ArtBoard extends DomItem {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "artboard",
      name: "New ArtBoard",
      width: Length.px(1000),
      height: Length.px(1000),
      'background-color': 'white',
      'transform-style': 'flat',
      ...obj
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs('name'),
    }
  }  

  getDefaultTitle() {
    return "ArtBoard";
  }

  getIcon() {
    return icon.artboard;
  }

  editable(editablePropertyName) {

    switch (editablePropertyName) {
    case 'border':
    case 'border-radius':
    case 'backdrop-filter':
    case 'box-shadow':
    case 'clip-path':
      return false;
    case 'artboard-size':
    case 'layout':
      return true;
    }

    return super.editable(editablePropertyName);
  }


}