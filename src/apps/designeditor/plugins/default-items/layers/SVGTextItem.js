import { SVGModel } from "./SVGModel";

import icon from "elf/editor/icon/icon";
import { Length } from "elf/editor/unit/Length";

export class SVGTextItem extends SVGModel {
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
      "fontWeight": Length.number(100),
      textLength: Length.em(0),
      lengthAdjust: "spacingAndGlyphs",
      ...obj,
    });
  }

  get text() {
    return this.get("text");
  }

  set text(value) {
    this.set("text", value);
  }

  get textLength() {
    return this.get("textLength");
  }

  set textLength(value) {
    this.set("textLength", value);
  }

  get lengthAdjust() {
    return this.get("lengthAdjust");
  }

  set lengthAdjust(value) {
    this.set("lengthAdjust", value);
  }

  enableHasChildren() {
    return false;
  }

  convert(json) {
    json = super.convert(json);

    json.textLength = Length.parse(json.textLength);

    return json;
  }

  // toCloneObject() {
  //   return {
  //     ...super.toCloneObject(),
  //     ...this.attrs("text", "textLength", "lengthAdjust"),
  //   };
  // }

  getDefaultTitle() {
    return "Text";
  }
}
