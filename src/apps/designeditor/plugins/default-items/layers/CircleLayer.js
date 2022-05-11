import icon from "elf/editor/icon/icon";
import { LayerModel } from "elf/editor/model/LayerModel";

export class CircleLayer extends LayerModel {
  getIcon() {
    return icon.lens;
  }

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "circle",
      name: "New Circle",
      borderRadius: "100%",
      ...obj,
    });
  }

  getDefaultTitle() {
    return "Circle";
  }
}
