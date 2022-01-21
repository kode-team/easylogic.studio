import { Length } from "el/editor/unit/Length";
import icon from "el/editor/icon/icon";
import { LayerModel } from "el/editor/model/LayerModel";

export class ArtBoard extends LayerModel {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "artboard",
      name: "New ArtBoard",
      width: 1000,
      height: 1000,
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
      return false;
    case 'artboard-size':
    case 'layout':
      return true;
    }

    return super.editable(editablePropertyName);
  }


}