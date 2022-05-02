import { vec3 } from "gl-matrix";

import { SVGItem } from "./SVGItem";

import icon from "elf/editor/icon/icon";
import { PathParser } from "elf/editor/parser/PathParser";

export class SVGPolygonItem extends SVGItem {
  getIcon() {
    return icon.edit;
  }
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "polygon",
      name: "New Polygon",
      "stroke-width": 1,
      count: 3, // 기본 변의 개수는 3개 , 삼각형
      ...obj,
    });
  }

  convert(json) {
    json = super.convert(json);

    if (json.count) json.count = +json.count;

    return json;
  }

  enableHasChildren() {
    return false;
  }

  get editablePath() {
    // editing 막기
    return false;
  }

  get d() {
    const { width, height, count } = this.json;

    return PathParser.makePolygon(width, height, count).d;
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs("count"),
    };
  }

  getDefaultTitle() {
    return "Polygon";
  }

  isPointInPath(point) {
    const localPoint = vec3.transformMat4(
      [],
      point,
      this.absoluteMatrixInverse
    );

    return this.cachePath.isPointInPath(
      { x: localPoint[0], y: localPoint[1] },
      this.json["stroke-width"] || 0
    );
  }
}
