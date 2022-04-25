import { SVGItem } from "./SVGItem";

import icon from "elf/editor/icon/icon";
import { PathParser } from "elf/editor/parser/PathParser";
import { Length } from "elf/editor/unit/Length";

export class SVGTextPathItem extends SVGItem {
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

  enableHasChildren() {
    return false;
  }

  refreshMatrixCache() {
    super.refreshMatrixCache();

    if (this.hasChangedField("d")) {
      this.cachePath = new PathParser(this.json.d);
      this.cacheWidth = this.json.width;
      this.cacheHeight = this.json.height;
    } else if (this.hasChangedField("width", "height")) {
      this.json.d = this.cachePath
        .clone()
        .scale(
          this.json.width / this.cacheWidth,
          this.json.height / this.cacheHeight
        ).d;
      this.modelManager.setChanged("reset", this.id, { d: this.json.d });
    }

    // this.modelManager.setChanged('refreshMatrixCache', this.id, { start: true, redefined: true })
  }

  get d() {
    if (!this.json.d) {
      return null;
    }

    if (!this.cachePath) {
      this.cachePath = new PathParser(this.json.d);
      this.cacheWidth = this.json.width;
      this.cacheHeight = this.json.height;
    }

    return this.cachePath
      .clone()
      .scale(
        this.json.width / this.cacheWidth,
        this.json.height / this.cacheHeight
      ).d;
  }

  convert(json) {
    json = super.convert(json);

    json.textLength = Length.parse(json.textLength);
    json.startOffset = Length.parse(json.startOffset);

    return json;
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs(
        "totalLength",
        "d",
        "text",
        "textLength",
        "lengthAdjust",
        "startOffset"
      ),
    };
  }

  getDefaultTitle() {
    return "TextPath";
  }
}
