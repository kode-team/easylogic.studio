import icon from "elf/editor/icon/icon";
import { LayerModel } from "elf/editor/model/LayerModel";

export class ArtBoard extends LayerModel {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "artboard",
      name: "New ArtBoard",
      width: 1000,
      height: 1000,
      backgroundColor: "white",
      transformStyle: "flat",
      ...obj,
    });
  }

  getDefaultTitle() {
    return "ArtBoard";
  }

  getIcon() {
    return icon.artboard;
  }

  editable(editablePropertyName) {
    switch (editablePropertyName) {
      case "border":
      case "borderRadius":
        return false;
      case "artboardSize":
      case "layout":
        return true;
    }

    return super.editable(editablePropertyName);
  }
}
