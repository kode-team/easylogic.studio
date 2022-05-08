import { createBezier } from "elf/core/bezier";
import { getClosestPointBylineLine, polyPoint } from "elf/core/collision";

export class MeshTransform {
  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {number} rowCount
   * @param {number} columnCount
   * @param {PathParser} path
   */
  constructor(x, y, width, height, rowCount = 4, columnCount = 4, path) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.rowCount = rowCount;
    this.columnCount = columnCount;

    this.rowUnitSize = height / rowCount;
    this.columnUnitSize = width / columnCount;

    this.path = path;
    this.clonedPath = path.clone();
    this.pathVertorMap = [];

    this.initialize();
  }

  makePoint() {
    this.points = [];
    const startX = this.x;
    const startY = this.y;

    for (var row = 0; row <= this.rowCount; row++) {
      for (var col = 0; col <= this.columnCount; col++) {
        this.points[row * (this.columnCount + 1) + col] = {
          row,
          col,
          x: startX + this.columnUnitSize * col,
          y: startY + this.rowUnitSize * row,
        };
      }
    }
  }

  /**
   *
   * @param {*} row
   * @param {*} col
   * @returns {{x: number, y: number}}
   */
  getPoint(row, col) {
    return this.points[row * (this.columnCount + 1) + col];
  }

  makePathVectorKey(startRow, startCol, endRow, endCol) {
    return `${startRow}_${startCol}_${endRow}_${endCol}`;
  }

  makePathVectorMap(startRow, startCol, endRow, endCol) {
    const key = this.makePathVectorKey(startRow, startCol, endRow, endCol);

    const currentItem = this.pathVertorMap.find((it) => it.key === key);

    if (currentItem) {
      return currentItem;
    }

    const startPoint = this.getPoint(startRow, startCol);
    const endPoint = this.getPoint(endRow, endCol);

    this.pathVertorMap.push({
      key,
      startRow,
      startCol,
      endRow,
      endCol,
      path: [
        startPoint.x,
        startPoint.y,
        startPoint.x + (endPoint.x - startPoint.x) * 0.33,
        startPoint.y + (endPoint.y - startPoint.y) * 0.33,
        startPoint.x + (endPoint.x - startPoint.x) * 0.66,
        startPoint.y + (endPoint.y - startPoint.y) * 0.66,
        endPoint.x,
        endPoint.y,
      ],
    });
  }

  makeVector(row, col) {
    const p00 = [row, col];
    const p01 = [row, col + 1];
    const p10 = [row + 1, col];
    const p11 = [row + 1, col + 1];

    const top = [p00, p01];
    const left = [p00, p10];
    const right = [p01, p11];
    const bottom = [p10, p11];

    // 방향별 vector 를 만들고 curve 롤 변환한다.
    this.makePathVectorMap(top[0][0], top[0][1], top[1][0], top[1][1]);
    this.makePathVectorMap(left[0][0], left[0][1], left[1][0], left[1][1]);
    this.makePathVectorMap(right[0][0], right[0][1], right[1][0], right[1][1]);
    this.makePathVectorMap(
      bottom[0][0],
      bottom[0][1],
      bottom[1][0],
      bottom[1][1]
    );

    return {
      type: "vector",
      row,
      col,
      p00,
      p01,
      p10,
      p11,
      top,
      left,
      right,
      bottom,
    };
  }

  makeVectorGroup() {
    this.vectorGroup = [];

    for (var row = 0; row < this.rowCount; row++) {
      for (var col = 0; col < this.columnCount; col++) {
        this.vectorGroup.push(this.makeVector(row, col));
      }
    }
  }

  searchPointByVectorGroup() {
    let pathVerties = this.path.pathVerties;

    this.vectorGroup.forEach((vg) => {
      const point00 = this.getPoint(vg.p00[0], vg.p00[1]);
      const point01 = this.getPoint(vg.p01[0], vg.p01[1]);
      const point10 = this.getPoint(vg.p10[0], vg.p10[1]);
      const point11 = this.getPoint(vg.p11[0], vg.p11[1]);

      const verties = [
        [point00.x, point00.y, 0],
        [point01.x, point01.y, 0],
        [point11.x, point11.y, 0],
        [point10.x, point10.y, 0],
      ];

      const result = [];
      const resultIndexes = [];

      for (let i = 0; i < pathVerties.length; i++) {
        const p = pathVerties[i];
        const r = polyPoint(verties, p.x, p.y);

        if (r) {
          result.push(p);
          resultIndexes.push(i);
          // break;
        }
      }

      // 해당 group 에 속한 pathVerties 만 수집한다.
      vg.pathVerties = result;

      vg.pathVerties.forEach((pv) => {
        pv.topT = (pv.x - point00.x) / (point01.x - point00.x);
        pv.leftT = (pv.y - point00.y) / (point10.y - point00.y);
        pv.rightT = (pv.y - point01.y) / (point11.y - point01.y);
        pv.bottomT = (pv.x - point10.x) / (point11.x - point10.x);
      });

      // 비교 한건 지운다.
      // pathVerties = pathVerties.filter((pv, index) => resultIndexes.includes(index) === false);
    });
  }

  initialize() {
    this.makePoint();
    this.makeVectorGroup();
    this.searchPointByVectorGroup();
  }

  /**
   * 생성된 vector map 을 그대로 svg path string 으로 만들어준다.
   */
  convertPathString() {
    const paths = [];
    this.pathVertorMap.forEach((v) => {
      const [x, y, c1x, c1y, c2x, c2y, ex, ey] = v.path;
      paths.push(`M ${x} ${y} C ${c1x} ${c1y} ${c2x} ${c2y} ${ex} ${ey}`);
    });

    return paths.join(" ");
  }

  /**
   * 변환된 Path 정보를 pathVectorMap 에 적용한다.
   *
   * @param {PathParser} path
   * @returns {MeshTransform}
   */
  transformByPath(path) {
    path.forEachGroup((group, groupIndex) => {
      const pathVector = this.pathVertorMap[groupIndex];

      group.segments.forEach((s, segmentIndex) => {
        const prevSegment = group.segments[segmentIndex - 1];
        const lastValues = prevSegment?.segment?.values || [];
        const lastX = lastValues[lastValues.length - 2];
        const lastY = lastValues[lastValues.length - 1];
        const values = s.segment.values;

        if (s.segment.command === "C") {
          pathVector.path = [lastX, lastY, ...values];
        }
      });
    });

    return this;
  }

  /**
   * 변환된 pathVectorMap 을 가지고  최종 path 를 만든다.
   */
  release() {
    const localPath = this.clonedPath.clone();

    this.vectorGroup.forEach((v) => {
      this._releaseVector(v, localPath);
    });

    return localPath;
  }

  makeCurveFunction(pathVector) {
    const [x, y, c1x, c1y, c2x, c2y, ex, ey] = pathVector.path;

    return createBezier(
      { x, y },
      { x: c1x, y: c1y },
      { x: c2x, y: c2y },
      { x: ex, y: ey }
    );
  }

  _releaseVector(vector, path) {
    const { top, left, right, bottom, pathVerties } = vector;

    const topKey = this.makePathVectorKey(
      top[0][0],
      top[0][1],
      top[1][0],
      top[1][1]
    );
    const leftKey = this.makePathVectorKey(
      left[0][0],
      left[0][1],
      left[1][0],
      left[1][1]
    );
    const rightKey = this.makePathVectorKey(
      right[0][0],
      right[0][1],
      right[1][0],
      right[1][1]
    );
    const bottomKey = this.makePathVectorKey(
      bottom[0][0],
      bottom[0][1],
      bottom[1][0],
      bottom[1][1]
    );

    const topVector = this.pathVertorMap.find((it) => it.key === topKey);
    const leftVector = this.pathVertorMap.find((it) => it.key === leftKey);
    const rightVector = this.pathVertorMap.find((it) => it.key === rightKey);
    const bottomVector = this.pathVertorMap.find((it) => it.key === bottomKey);

    const topCurveFunction = this.makeCurveFunction(topVector);
    const leftCurveFunction = this.makeCurveFunction(leftVector);
    const rightCurveFunction = this.makeCurveFunction(rightVector);
    const bottomCurveFunction = this.makeCurveFunction(bottomVector);

    pathVerties.forEach((pv) => {
      const [x, y] = this.calculateCubicInterpolate(
        pv,
        topCurveFunction,
        leftCurveFunction,
        rightCurveFunction,
        bottomCurveFunction
      );

      path.segments[pv.segmentIndex].values[pv.valueIndex] = x;
      path.segments[pv.segmentIndex].values[pv.valueIndex + 1] = y;
    });
  }

  /**
   *
   * 두 벡터의 교점을 검사함
   *
   * @param {{
   *       topT: number,
   *      leftT: number,
   *     rightT: number,
   *    bottomT: number
   * }} pv
   * @param {Function} topCurveFunction
   * @param {Function} leftCurveFunction
   * @param {Function} rightCurveFunction
   * @param {Function} bottomCurveFunction
   * @returns {vec3[]}
   */
  calculateCubicInterpolate(
    pv,
    topCurveFunction,
    leftCurveFunction,
    rightCurveFunction,
    bottomCurveFunction
  ) {
    const topPoint = topCurveFunction(pv.topT);
    const leftPoint = leftCurveFunction(pv.leftT);
    const rightPoint = rightCurveFunction(pv.rightT);
    const bottomPoint = bottomCurveFunction(pv.bottomT);

    const vector1 = [
      [topPoint.x, topPoint.y, 0],
      [bottomPoint.x, bottomPoint.y, 0],
    ];

    const vector2 = [
      [leftPoint.x, leftPoint.y, 0],
      [rightPoint.x, rightPoint.y, 0],
    ];

    return getClosestPointBylineLine(
      vector1[0][0],
      vector1[0][1],
      vector1[1][0],
      vector1[1][1],
      vector2[0][0],
      vector2[0][1],
      vector2[1][0],
      vector2[1][1]
    );
  }
}
