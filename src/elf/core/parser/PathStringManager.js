export class PathStringManager {
  constructor() {
    this.pathArray = [];
  }

  reset() {
    this.pathArray = [];
  }

  getPointString(values) {
    return values.map((v) => `${v.x} ${v.y}`).join(" ");
  }

  makeString(command, values = []) {
    this.pathArray.push(`${command} ${this.getPointString(values)}`);
    return this;
  }

  M(...values) {
    return this.makeString("M", values);
  }

  L(...values) {
    return this.makeString("L", values);
  }

  /**
   * x 표 그리기
   *
   * @param  {Point[]} values
   */
  X(...values) {
    const dist = 3;
    const point = values[0];

    const topLeft = { x: point.x - dist, y: point.y - dist };
    const topRight = { x: point.x + dist, y: point.y - dist };
    const bottomLeft = { x: point.x - dist, y: point.y + dist };
    const bottomRight = { x: point.x + dist, y: point.y + dist };

    return this.M(topLeft).L(bottomRight).M(topRight).L(bottomLeft);
  }

  Q(...values) {
    return this.makeString("Q", values);
  }

  C(...values) {
    return this.makeString("C", values);
  }

  Z() {
    return this.makeString("Z");
  }

  get d() {
    return this.pathArray.join(" ").trim();
  }

  toString(className = "object") {
    return /*html*/ `<path d="${this.d}" class='${className}'/>`;
  }
}
