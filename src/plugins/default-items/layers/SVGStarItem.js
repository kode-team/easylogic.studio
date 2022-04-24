import { PathParser } from "elf/editor/parser/PathParser";
import icon from "elf/editor/icon/icon";
import { SVGItem } from "./SVGItem";

export class SVGStarItem extends SVGItem {
  getIcon() {
    return icon.star;
  }
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "star",
      name: "New Star",
      "stroke-width": 1,
      d: "", // 이건 최종 결과물로만 쓰고 나머지는 모두 segments 로만 사용한다.
      isCurve: false,
      count: 5, // outer radius
      radius: 0.5, // inner radius rate
      tension: 0.5, // 각도 간격
      ...obj,
    });
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
    const { width, height, count, radius, tension, isCurve } = this.json;

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

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs("count", "radius", "tension", "isCurve"),
    };
  }

  getDefaultTitle() {
    return "Star";
  }
}
