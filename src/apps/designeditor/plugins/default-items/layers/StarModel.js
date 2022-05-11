import { SVGModel } from "./SVGModel";

import { PathParser } from "elf/core/parser/PathParser";
import icon from "elf/editor/icon/icon";

export class StarModel extends SVGModel {
  getIcon() {
    return icon.star;
  }
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "star",
      name: "New Star",
      strokeWidth: 1,
      isCurve: false,
      count: 5, // outer radius
      radius: 0.5, // inner radius rate
      tension: 0.5, // 각도 간격
      ...obj,
    });
  }

  get count() {
    return this.get("count");
  }

  set count(value) {
    this.set("count", value);
  }

  get radius() {
    return this.get("radius");
  }

  set radius(value) {
    this.set("radius", value);
  }

  get tension() {
    return this.get("tension");
  }

  set tension(value) {
    this.set("tension", value);
  }

  get isCurve() {
    return this.get("isCurve");
  }

  convert(json) {
    json = super.convert(json);

    if (json.count) json.count = +json.count;
    if (json.radius) json.radius = +json.radius;
    if (json.tension) json.tension = +json.tension;

    return json;
  }

  enableHasChildren() {
    return false;
  }

  get d() {
    const { width, height, count, radius, tension, isCurve } = this;

    let newPath = "";
    if (isCurve) {
      newPath = PathParser.makeCurvedStar(
        width,
        height,
        count,
        radius,
        tension
      ).d;
    } else {
      newPath = PathParser.makeStar(width, height, count, radius).d;
    }

    return newPath;
  }

  // toCloneObject() {
  //   return {
  //     ...super.toCloneObject(),
  //     ...this.attrs("count", "radius", "tension", "isCurve"),
  //   };
  // }

  getDefaultTitle() {
    return "Star";
  }
}
