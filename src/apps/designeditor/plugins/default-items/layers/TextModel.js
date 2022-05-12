import icon from "elf/editor/icon/icon";
import { LayerModel } from "elf/editor/model/LayerModel";

export class TextModel extends LayerModel {
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

  get content() {
    return this.get("content");
  }

  set content(value) {
    this.set("content", value);
  }

  enableHasChildren() {
    return false;
  }

  getDefaultTitle() {
    return "Text";
  }

  // toCloneObject() {
  //   return {
  //     ...super.toCloneObject(),
  //     ...this.attrs("content"),
  //   };
  // }

  editable(editablePropertyName) {
    switch (editablePropertyName) {
      case "svg-item":
      case "transform":
      case "transformOrigin":
      case "perspective":
      case "perspectiveOrigin":
      case "layout":
        return false;
      case "font":
      case "fontSpacing":
      case "textStyle":
      case "textShadow":
      case "textFill":
      case "textClip":
      case "backgroundImage":
      case "box-model":
      case "border":
      case "borderRadius":
      case "backdropFilter":
      case "pattern":
        return true;
    }

    return super.editable(editablePropertyName);
  }
}
