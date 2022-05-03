import icon from "elf/editor/icon/icon";
import { LayerModel } from "elf/editor/model/LayerModel";

export class TextLayer extends LayerModel {
  getIcon() {
    return icon.title;
  }
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "text",
      name: "New Text",
      elementType: "p",
      content: "",
      ...obj,
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
      ...this.attrs("content"),
    };
  }

  editable(editablePropertyName) {
    switch (editablePropertyName) {
      case "svg-item":
      case "transform":
      case "transform-origin":
      case "perspective":
      case "perspective-origin":
      case "layout":
        return false;
      case "font":
      case "font-spacing":
      case "text-style":
      case "text-shadow":
      case "text-fill":
      case "text-clip":
      case "background-image":
      case "box-model":
      case "border":
      case "border-radius":
      case "backdrop-filter":
      case "pattern":
        return true;
    }

    return super.editable(editablePropertyName);
  }
}
