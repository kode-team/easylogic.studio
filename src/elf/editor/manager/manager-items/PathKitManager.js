/*
refer to https://skia.org/docs/user/modules/pathkit/#constants


PathOp (enum)
The following enum values are exposed. They are essentially constant objects, differentiated by their .value property.

PathKit.PathOp.DIFFERENCE
PathKit.PathOp.INTERSECT
PathKit.PathOp.REVERSE_DIFFERENCE
PathKit.PathOp.UNION
PathKit.PathOp.XOR
These are used in PathKit.MakeFromOp() and SkPath.op().

FillType (enum)
The following enum values are exposed. They are essentially constant objects, differentiated by their .value property.

PathKit.FillType.WINDING (also known as nonzero)
PathKit.FillType.EVENODD
PathKit.FillType.INVERSE_WINDING
PathKit.FillType.INVERSE_EVENODD
These are used by SkPath.getFillType() and SkPath.setFillType(), but generally clients will want SkPath.getFillTypeString().

StrokeJoin (enum)
The following enum values are exposed. They are essentially constant objects, differentiated by their .value property.

PathKit.StrokeJoin.MITER
PathKit.StrokeJoin.ROUND
PathKit.StrokeJoin.BEVEL
See SkPaint reference for more details.

StrokeCap (enum)
The following enum values are exposed. They are essentially constant objects, differentiated by their .value property.

PathKit.StrokeCap.BUTT
PathKit.StrokeCap.ROUND
PathKit.StrokeCap.SQUARE
See SkPaint reference for more details.

Constants
The following constants are exposed:

PathKit.MOVE_VERB = 0
PathKit.LINE_VERB = 1
PathKit.QUAD_VERB = 2
PathKit.CONIC_VERB = 3
PathKit.CUBIC_VERB = 4
PathKit.CLOSE_VERB = 5
These are only needed for PathKit.FromCmds().

*/

import PathKitInit from "pathkit-wasm/bin/pathkit";

import { isArray } from "sapa";

import { PathParser } from "elf/editor/parser/PathParser";

export class PathKitManager {
  constructor(editor) {
    this.editor = editor;
    this.pathkit = null;
  }

  async load() {
    this.registerPathKit(await PathKitInit());
  }

  registerPathKit(pathkit) {
    this.pathkit = pathkit;
    this.editor.emit("updatePathKit");
  }

  has() {
    return !!this.pathkit;
  }

  booleanOperation(first, second, pathOp) {
    const PathKit = this.pathkit;

    return PathKit.MakeFromOp(
      PathKit.FromSVGString(first),
      PathKit.FromSVGString(second),
      pathOp
    ).toSVGString();
  }

  intersection(first, second) {
    const PathKit = this.pathkit;
    if (!PathKit) return;
    return this.reversePathString(
      this.booleanOperation(first, second, PathKit.PathOp.INTERSECT)
    );
  }

  union(first, second) {
    const PathKit = this.pathkit;
    if (!PathKit) return;
    return this.booleanOperation(first, second, PathKit.PathOp.UNION);
  }

  difference(first, second) {
    const PathKit = this.pathkit;
    if (!PathKit) return;
    return this.reversePathString(
      this.booleanOperation(first, second, PathKit.PathOp.DIFFERENCE)
    );
  }

  reverseDifference(first, second) {
    const PathKit = this.pathkit;
    if (!PathKit) return;
    return this.reversePathString(
      this.booleanOperation(first, second, PathKit.PathOp.REVERSE_DIFFERENCE)
    );
  }

  xor(first, second) {
    const PathKit = this.pathkit;
    if (!PathKit) return;
    return this.reversePathString(
      this.booleanOperation(first, second, PathKit.PathOp.XOR)
    );
  }

  reversePathString(pathString) {
    // xor 의 경우 변환하면 path 가 2개 이상 나올 수 있는데
    // 이때 내부의 영역도 하나의 패스로 나오기 때문에
    // svg 에서 제대로 표시를 해줄려면 특정 구간은 역순으로 나열 해줘야 한다.
    return PathParser.fromSVGString(pathString).reversePathStringByFunc(
      (_, index) => index % 2 === 0
    );
  }

  isValidPath(path) {
    const PathKit = this.pathkit;

    let pathKitPath = PathKit.FromSVGString(path);

    return pathKitPath.isValid();
  }

  /**
   * 2d Path 내부의 segment 를 합쳐준다.
   *
   * @param {string} path
   * @returns {string}
   */
  simplify(path) {
    const PathKit = this.pathkit;
    const pathObject = PathKit.FromSVGString(path);

    return pathObject.simplify().toSVGString();
  }

  convertLineJoin(lineJoin) {
    const PathKit = this.pathkit;
    switch (lineJoin) {
      case "miter":
        return PathKit.StrokeJoin.MITER;
      case "round":
        return PathKit.StrokeJoin.ROUND;
      case "bevel":
        return PathKit.StrokeJoin.BEVEL;
    }
  }

  convertLineCap(lineCap) {
    const PathKit = this.pathkit;
    switch (lineCap) {
      case "butt":
        return PathKit.StrokeCap.BUTT;
      case "round":
        return PathKit.StrokeCap.ROUND;
      case "square":
        return PathKit.StrokeCap.SQUARE;
    }
  }

  stroke(path, opt = { width: 1, miter_limit: 4 }) {
    const PathKit = this.pathkit;
    const pathObject = PathKit.FromSVGString(path);

    if (isArray(opt["stroke-dasharray"])) {
      const arr = opt["stroke-dasharray"];

      if (arr.length >= 2) {
        pathObject.dash(arr[0], arr[1], +(opt["stroke-dashoffset"] || 0));
      }
    }

    let newPathObject = pathObject.stroke({
      width: +opt["stroke-width"],
      join: this.convertLineJoin(opt["stroke-linejoin"]),
      cap: this.convertLineCap(opt["stroke-linecap"]),
    });

    // fill 타입이 있어야 채워질 수 있는데.
    newPathObject.setFillType(PathKit.FillType.WINDING);

    return newPathObject.simplify().toSVGString();
  }

  round(path, opt = { width: 1, miter_limit: 4 }) {
    return this.stroke(path, {
      ...opt,
      "stroke-linejoin": "round",
    });
  }

  grow(path, opt = { width: 1, miter_limit: 4 }) {
    const PathKit = this.pathkit;
    const pathObject = PathKit.FromSVGString(path);

    return pathObject
      .copy()
      .stroke(opt)
      .op(pathObject, PathKit.PathOp.DIFFERENCE)
      .toSVGString();
  }

  shrink(path, opt = { width: 1, miter_limit: 4 }) {
    const PathKit = this.pathkit;
    const pathObject = PathKit.FromSVGString(path);

    const simplifyPath = pathObject.copy().simplify();
    return pathObject
      .copy()
      .stroke(opt)
      .op(simplifyPath, PathKit.PathOp.DIFFERENCE)
      .toSVGString();
  }

  dash(path, on, off, phase = 1) {
    const PathKit = this.pathkit;
    const pathObject = PathKit.FromSVGString(path);

    return pathObject.dash(on, off, phase).toSVGString();
  }

  trim(path, startT, stopT, isComplement = false) {
    const PathKit = this.pathkit;
    const pathObject = PathKit.FromSVGString(path);

    return pathObject.trim(startT, stopT, isComplement).toSVGString();
  }
}
