import { SVGItem } from "./SVGItem";

import icon from "elf/editor/icon/icon";
import { Length } from "elf/editor/unit/Length";

export class SVGTextItem extends SVGItem {
  getIcon() {
    return icon.title;
  }
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "svg-text",
      name: "New Text",
      totalLength: 0,
      fill: "rgba(0, 0, 0, 1)",
      text: "Insert a text",
      "font-weight": Length.number(100),
      textLength: Length.em(0),
      lengthAdjust: "spacingAndGlyphs",
      "shape-inside": "",
      "shape-subtract": "",
      "shape-margin": "",
      "shape-padding": "",
      ...obj,
    });
  }

  enableHasChildren() {
    return false;
  }

  convert(json) {
    json = super.convert(json);

    json.textLength = Length.parse(json.textLength);

    return json;
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs(
        "totalLength",
        "text",
        "textLength",
        "lengthAdjust",
        "shape-inside"
      ),
    };
  }

  getDefaultTitle() {
    return "Text";
  }
}
