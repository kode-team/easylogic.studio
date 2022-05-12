import { vec3 } from "gl-matrix";
import nurbs from "nurbs";

import { SVGModel } from "./SVGModel";

import { PathParser } from "elf/core/parser/PathParser";
import icon from "elf/editor/icon/icon";

export class SplineModel extends SVGModel {
  getIcon() {
    return icon.star;
  }
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "spline",
      name: "New Spline",
      strokeWidth: 1,
      points: [],
      traceCount: 100,
      degree: 2,
      boundary: "clamped",
      ...obj,
    });
  }

  get points() {
    return this.get("points");
  }

  set points(value) {
    this.set("points", value);
  }

  get degree() {
    return this.get("degree");
  }

  set degree(value) {
    this.set("degree", value);
  }

  get traceCount() {
    return this.get("traceCount");
  }

  set traceCount(value) {
    this.set("traceCount", value);
  }

  get boundary() {
    return this.get("boundary");
  }

  set boundary(value) {
    this.set("boundary", value);
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

      this.points = this.cachePath
        .clone()
        .scale(
          this.width / this.cacheWidth,
          this.height / this.cacheHeight
        ).verties;
      this.modelManager.setChanged("reset", this.id, {
        points: this.points,
      });
    }
  }

  setCache() {
    super.setCache();

    this.cachePath = PathParser.makePathByVerties(this.points);
    this.cacheWidth = this.width;
    this.cacheHeight = this.height;
  }

  get editablePath() {
    let { width, height, points } = this;

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
    return this.getPath(this.points, this.boundary);
  }

  getPath(points, boundary) {
    let { width, height } = this;

    if (!points) {
      points = this.points;
    }
    if (!boundary) {
      boundary = this.boundary;
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

  // toCloneObject(isDeep = true) {
  //   return {
  //     ...super.toCloneObject(isDeep),
  //     ...this.attrs("points", "degree", "boundary", "traceCount"),
  //   };
  // }

  getDefaultTitle() {
    return "BSpline";
  }
}
