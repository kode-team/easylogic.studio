import { SVGModel } from "./SVGModel";

import { PathParser } from "elf/core/parser/PathParser";
import icon from "elf/editor/icon/icon";
import { Length } from "elf/editor/unit/Length";

export class SVGTextPathItem extends SVGModel {
  getIcon() {
    return icon.text_rotate;
  }
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "svg-textpath",
      name: "New TextPath",
      d: "",
      // segments: [],
      totalLength: 0,
      fill: "rgba(0, 0, 0, 1)",
      text: "Insert a text",
      textLength: Length.em(0),
      lengthAdjust: "spacingAndGlyphs",
      startOffset: Length.em(0),
      ...obj,
    });
  }

  get d() {
    if (!this.get("d")) {
      return null;
    }

    if (!this.cachePath) {
      this.cachePath = new PathParser(this.get("d"));
      this.cacheWidth = this.width;
      this.cacheHeight = this.height;
    }

    return this.cachePath
      .clone()
      .scale(this.width / this.cacheWidth, this.height / this.cacheHeight).d;
  }

  set d(value) {
    this.set("d", value);
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

  get startOffset() {
    return this.get("startOffset");
  }

  set startOffset(value) {
    this.set("startOffset", value);
  }

  enableHasChildren() {
    return false;
  }

  refreshMatrixCache() {
    super.refreshMatrixCache();

    if (this.hasChangedField("d")) {
      this.cachePath = new PathParser(this.get("d"));
      this.cacheWidth = this.width;
      this.cacheHeight = this.height;
    } else if (this.hasChangedField("width", "height")) {
      this.d = this.cachePath
        .clone()
        .scale(this.width / this.cacheWidth, this.height / this.cacheHeight).d;
      this.modelManager.setChanged("reset", this.id, { d: this.d });
    }

    // this.modelManager.setChanged('refreshMatrixCache', this.id, { start: true, redefined: true })
  }

  convert(json) {
    json = super.convert(json);

    json.textLength = Length.parse(json.textLength);
    json.startOffset = Length.parse(json.startOffset);

    return json;
  }

  // toCloneObject() {
  //   return {
  //     ...super.toCloneObject(),
  //     ...this.attrs("d", "text", "textLength", "lengthAdjust", "startOffset"),
  //   };
  // }

  getDefaultTitle() {
    return "TextPath";
  }
}
