import { EMPTY_STRING } from "../../util/css/types";
import { Length } from "../unit/Length";
import { Property } from "../items/Property";

export class BoxShadow extends Property {
  static parse(obj) {
    return new BoxShadow(obj);
  }
  getDefaultObject() {
    return super.getDefaultObject({
      itemType: "box-shadow",
      inset: false,
      offsetX: Length.px(0),
      offsetY: Length.px(0),
      blurRadius: Length.px(0),
      spreadRadius: Length.px(0),
      color: "rgba(0, 0, 0, 1)"
    });
  }

  toCSS() {
    return {
      "box-shadow": this.toString()
    };
  }

  toString() {
    var json = this.json;

    return `${json.inset ? "inset " : EMPTY_STRING}${json.offsetX} ${
      json.offsetY
    } ${json.blurRadius} ${json.spreadRadius} ${json.color}`;
  }
}
