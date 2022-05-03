/**
 * segment 객체 생성기
 * @class
 */
export class Segment {
  /**
   * MoveTo
   *
   * @param {number} x
   * @param {number} y
   * @returns {Object}
   */
  static M(x, y) {
    return {
      command: "M",
      values: [x, y],
    };
  }

  /**
   * LineTo
   *
   * @param {number} x
   * @param {number} y
   * @returns {Object}
   */
  static L(x, y) {
    return {
      command: "L",
      values: [x, y],
    };
  }

  /**
   * Quadratic Bezier Curve
   *
   * @param {number} x1
   * @param {number} y1
   * @param {number} x
   * @param {number} y
   * @returns {Object}
   */
  static Q(x1, y1, x, y) {
    return {
      command: "Q",
      values: [x1, y1, x, y],
    };
  }

  /**
   * Cubic Bezier Curve
   *
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {number} x
   * @param {number} y
   * @returns {Object}
   */
  static C(x1, y1, x2, y2, x, y) {
    return {
      command: "C",
      values: [x1, y1, x2, y2, x, y],
    };
  }

  /**
   * Arc
   *
   * @param {number} rx
   * @param {number} ry
   * @param {number} xrot
   * @param {number} laf
   * @param {number} sf
   * @param {number} x
   * @param {number} y
   * @returns {Object}
   */
  static A(rx, ry, xrot, laf, sf, x, y) {
    return {
      command: "A",
      values: [rx, ry, xrot, laf, sf, x, y],
    };
  }

  /**
   * Close Path
   *
   * @returns {Object}
   */
  static Z() {
    return {
      command: "Z",
      values: [], // closed path
    };
  }

  static isMoveTo(segment) {
    return segment.command === "M";
  }

  static isLineTo(segment) {
    return segment.command === "L";
  }

  static isQuadraticBezierCurve(segment) {
    return segment.command === "Q";
  }

  static isCubicBezierCurve(segment) {
    return segment.command === "C";
  }

  static isArc(segment) {
    return segment.command === "A";
  }

  static isClosePath(segment) {
    return segment.command === "Z";
  }
}
