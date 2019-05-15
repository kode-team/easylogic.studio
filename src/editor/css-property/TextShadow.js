import { Length } from "../unit/Length";
import { Property } from "../items/Property";

export class TextShadow extends Property {
  static parse(obj) {
    return new TextShadow(obj);
  }

  getDefaultObject() {
    return super.getDefaultObject({
      itemType: "text-shadow",
      offsetX: Length.px(0),
      offsetY: Length.px(0),
      blurRadius: Length.px(0),
      color: "rgba(0, 0, 0, 0)"
    });
  }

  toCSS() {
    return {
      "text-shadow": this.toString()
    };
  }

  toString() {
    var json = this.json;

    return `${json.offsetX} ${json.offsetY} ${json.blurRadius} ${json.color}`;
  }
}
