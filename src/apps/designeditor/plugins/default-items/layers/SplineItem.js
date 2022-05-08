import { vec3 } from "gl-matrix";
import nurbs from "nurbs";

import { SVGItem } from "./SVGItem";

import { PathParser } from "elf/core/parser/PathParser";
import icon from "elf/editor/icon/icon";

export class SplineItem extends SVGItem {
  getIcon() {
    return icon.star;
  }
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "spline",
      name: "New Spline",
      "stroke-width": 1,
      points: [],
      traceCount: 100,
      degree: 2,
      boundary: "clamped",
      ...obj,
    });
  }

  enableHasChildren() {
    return false;
  }

  refreshMatrixCache() {
    super.refreshMatrixCache();

    if (this.hasChangedField("points", "boundary")) {
      this.setCache();
    } else if (this.hasChangedField("width", "height")) {
      if (!this.cachePath) {
        this.setCache();
      }

      this.json.points = this.cachePath
        .clone()
        .scale(
          this.json.width / this.cacheWidth,
          this.json.height / this.cacheHeight
        ).verties;
      this.modelManager.setChanged("reset", this.id, {
        points: this.json.points,
      });
    }
  }

  setCache() {
    super.setCache();

    this.cachePath = PathParser.makePathByVerties(this.json.points);
    this.cacheWidth = this.json.width;
    this.cacheHeight = this.json.height;
  }

  get editablePath() {
    let { width, height, points } = this.json;

    if (!points || points.length == 0) {
      points = [
        [0, height],
        [0, 0],
        [width, 0],
        [width, height],
      ];
    }

    return this.absolutePath(PathParser.makePathByVerties(points).d).d;
  }

  recoverEditablePath(d) {
    const points = this.invertPath(d).verties;
    const pathData = this.updatePath(this.getPath(points));
    delete pathData.d;

    return {
      points,
      ...pathData,
    };
  }

  get d() {
    return this.getPath(this.json.points, this.json.boundary);
  }

  getPath(points, boundary) {
    let { width, height } = this.json;

    if (!points) {
      points = this.json.points;
    }
    if (!boundary) {
      boundary = this.json.boundary;
    }

    if (!points || points.length == 0) {
      points = [
        [0, height],
        [0, 0],
        [width, 0],
        [width, height],
      ];
    }

    const curve = nurbs({
      points,
      degree: points.length - 2,
      boundary,
    });
    const pt = [];
    const verties = [];
    const traceCount = (points.length - 1) * 100;
    const unit = 1 / traceCount;
    const d0 = curve.domain[0][0];
    const d1 = curve.domain[0][1];

    for (var t = 0; t <= 1; t += unit) {
      curve.evaluate(pt, d0 + (d1 - d0) * t);

      verties.push(vec3.clone(pt));
    }

    return PathParser.makePathByVerties(verties, false).round(1000).d;
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs("points", "degree", "boundary"),
    };
  }

  getDefaultTitle() {
    return "BSpline";
  }
}
