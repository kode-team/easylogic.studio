import { Length } from "@unit/Length";
import icon from "@icon/icon";
import { ComponentManager } from "../manager/ComponentManager";
import { DomItem } from "./DomItem";

export class ArtBoard extends DomItem {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "artboard",
      name: "New ArtBoard",
      width: Length.px(1000),
      height: Length.px(1000),
      'background-color': 'white',
      ...obj
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      name: this.json.name
    }
  }  

  getDefaultTitle() {
    return "ArtBoard";
  }

  getIcon() {
    return icon.artboard;
  }

}

ComponentManager.registerComponent('artboard', ArtBoard);