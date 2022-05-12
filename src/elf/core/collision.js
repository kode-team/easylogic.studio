import { vec3 } from "gl-matrix";

import { getPointBetweenVerties } from "./math";

import { TransformOrigin } from "elf/editor/property-parser/TransformOrigin";

/**
 * 포인트 충돌 체크
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
export function pointPoint(x1, y1, x2, y2) {
  return x1 === x2 && y1 === y2;
}

/**
 * 점간의 대략적인 거리의 위치 지정
 *
 * @param {vec3} s source vertex
 * @param {vec3} t target vertex
 * @param {number} [dist=0] check distance
 */
export function pointPointDist(s, t, dist = 0) {
  let targetX = Infinity;
  let targetY = Infinity;

  if (Math.abs(s[0] - t[0]) <= dist) {
    targetX = t[0];
  }

  if (Math.abs(s[1] - t[1]) <= dist) {
    targetY = t[1];
  }

  return { targetX, targetY };
}

/**
 * 점과 원의 충돌 체크
 *
 * @param {number} x1 x
 * @param {number} y1 y
 * @param {number} cx 원의 중심점 x
 * @param {number} cy 원의 중심점 y
 * @param {number} r 원의 반지름 radius
 */
export function pointCircle(x1, y1, cx, cy, r) {
  const distX = x1 - cx;
  const distY = y1 - cy;

  return Math.hypot(distX, distY) <= r;
}

/**
 * 원과 원의 충돌
 *
 * @param {number} cx1
 * @param {number} cy1
 * @param {number} r1
 * @param {number} cx2
 * @param {number} cy2
 * @param {number} r2
 */
export function circleCirce(cx1, cy1, r1, cx2, cy2, r2) {
  const distX = cx2 - cx1;
  const distY = cy2 - cy1;

  return Math.hypot(distX, distY) <= r1 + r2;
}

/**
 * 점과 사각형 충돌 체크
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} rx
 * @param {number} ry
 * @param {number} rw
 * @param {number} rh
 */
export function pointRect(x1, y1, rx, ry, rw, rh) {
  return rx <= x1 && x1 <= rx + rw && ry <= y1 && y1 <= ry + rh;
}

/**
 * 사각형과 사각형 충돌 체크
 *
 * @param {number} rx1
 * @param {number} ry1
 * @param {number} rw1
 * @param {number} rh1
 * @param {number} rx2
 * @param {number} ry2
 * @param {number} rw2
 * @param {number} rh2
 */
export function rectRect(rx1, ry1, rw1, rh1, rx2, ry2, rw2, rh2) {
  return (
    rx1 + rw1 >= rx2 && rx1 <= rx2 + rw2 && ry1 + rh1 >= ry2 && ry1 <= ry2 + rh2
  );
}

export class Rect {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  get left() {
    return this.x;
  }

  get right() {
    return this.x + this.width;
  }

  get top() {
    return this.y;
  }

  get bottom() {
    return this.y + this.height;
  }

  get centerX() {
    return this.x + this.width / 2;
  }

  get centerY() {
    return this.y + this.height / 2;
  }

  get center() {
    return [this.centerX, this.centerY];
  }

  get topLeft() {
    return [this.left, this.top];
  }

  get topRight() {
    return [this.right, this.top];
  }

  get bottomLeft() {
    return [this.left, this.bottom];
  }

  get bottomRight() {
    return [this.right, this.bottom];
  }

  get vertices() {
    return [this.topLeft, this.topRight, this.bottomLeft, this.bottomRight];
  }

  intersect(rect) {
    return intersectRectRect(this, rect);
  }
}

/**
 * 두 사각형의 교차점 구하기
 *
 * @param {Rect} rect1
 * @param {Rect} rect2
 * @returns {vec3[]}
 */
export function intersectRectRect(rect1, rect2) {
  const minRectX = Math.min(rect1.x, rect2.x);
  const minRectY = Math.min(rect1.y, rect2.y);

  const rect1Verties = rectToVerties(
    rect1.x - minRectX,
    rect1.y - minRectY,
    rect1.width,
    rect1.height
  );
  const rect2Verties = rectToVerties(
    rect2.x - minRectX,
    rect2.y - minRectY,
    rect2.width,
    rect2.height
  );

  const startPoint = [
    Math.max(rect1Verties[0][0], rect2Verties[0][0]),
    Math.max(rect1Verties[0][1], rect2Verties[0][1]),
    Math.max(rect1Verties[0][2], rect2Verties[0][2]),
  ];

  const endPoint = [
    Math.min(rect1Verties[2][0], rect2Verties[2][0]),
    Math.min(rect1Verties[2][1], rect2Verties[2][1]),
    Math.min(rect1Verties[2][2], rect2Verties[2][2]),
  ];

  const minX = Math.min(startPoint[0], endPoint[0]);
  const minY = Math.min(startPoint[1], endPoint[1]);
  const maxX = Math.max(startPoint[0], endPoint[0]);
  const maxY = Math.max(startPoint[1], endPoint[1]);

  return new Rect(minX + minRectX, minY + minRectY, maxX - minX, maxY - minY);
}

/**
 *
 * @param {number} cx
 * @param {number} cy
 * @param {number} r
 * @param {number} rx
 * @param {number} ry
 * @param {number} rw
 * @param {number} rh
 */
export function circleRect(cx, cy, r, rx, ry, rw, rh) {
  let testX = cx;
  let testY = cy;

  if (cx < rx) testX = rx;
  else if (cx > rx + rw) testX = rx + rw;

  if (cy < ry) testY = ry;
  else if (cy > ry + rh) testY = ry + rh;

  const distX = cx - testX;
  const distY = cy - testY;

  return Math.hypot(distX, distY) <= r;
}

/**
 *
 * 점이 line 에 속하는지 체크
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} px
 * @param {number} py
 * @param {number} buffer
 */
export function linePoint(x1, y1, x2, y2, px, py, buffer = 0.1) {
  const dist1 = Math.hypot(px - x1, py - y1);
  const dist2 = Math.hypot(px - x2, py - y2);

  const lineLength = Math.hypot(x1 - x2, y1 - y2);

  const calcDist = dist1 + dist2;

  return calcDist >= lineLength - buffer && calcDist <= lineLength + buffer;
}

/**
 *
 * 선과 원 체크
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} cx
 * @param {number} cy
 * @param {number} r
 */
export function lineCircle(x1, y1, x2, y2, cx, cy, r) {
  // 앙 옆의 점이 원 안에 있으면 true
  if (pointCircle(x1, y1, cx, cy, r)) return true;
  if (pointCircle(x2, y2, cx, cy, r)) return true;

  const lineLength = Math.hypot(x1 - x2, y1 - y2);

  const dot =
    ((cx - x1) * (x2 - x1) + (cy - y1) * (y2 - y1)) / Math.pow(lineLength, 2);

  const closestX = x1 + (x2 - x1) * dot;
  const closestY = y1 + (y2 - y1) * dot;

  if (linePoint(x1, y1, x2, y2, closestX, closestY) === false) {
    return false;
  }

  // 원의 중심과 가장 가까운 점의 거리 체크
  return Math.hypot(closestX - cx, closestY - cy) <= r;
}

/**
 *
 * 선분에서 원의 중심에 가장 가까운 점 찾기
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} cx
 * @param {number} cy
 * @param {number} r
 */
export function getClosestPointBylineCircle(x1, y1, x2, y2, cx, cy) {
  const lineLength = Math.hypot(x1 - x2, y1 - y2);

  const dot =
    ((cx - x1) * (x2 - x1) + (cy - y1) * (y2 - y1)) / Math.pow(lineLength, 2);

  const closestX = x1 + (x2 - x1) * dot;
  const closestY = y1 + (y2 - y1) * dot;

  return [closestX, closestY];
}

export function lineLineWithoutPoint(x1, y1, x2, y2, x3, y3, x4, y4) {
  // 선분 끝점이 겹치지 않는 경우만 체크한다.

  let A =
    ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  let B =
    ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  return 0 <= A && A <= 1 && 0 <= B && B <= 1;
}

export function lineLine(x1, y1, x2, y2, x3, y3, x4, y4, epsilon = 0.1) {
  // 선분의 끝이 겹치는 경우는 끝점을 바로 리턴해준다.
  if (linePoint(x1, y1, x2, y2, x3, y3)) return true;
  else if (linePoint(x1, y1, x2, y2, x4, y4)) return true;
  else if (linePoint(x3, y3, x4, y4, x1, y1)) return [x1, y1];
  else if (linePoint(x3, y3, x4, y4, x2, y2)) return [x2, y2];

  return lineLineWithoutPoint(x1, y1, x2, y2, x3, y3, x4, y4, epsilon);
}

/**
 *
 * 두개의 선분이 겹치는 점의 위치
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x3
 * @param {number} y3
 * @param {number} x4
 * @param {number} y4
 *
 * @returns {number[]}
 */
export function getClosestPointBylineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
  // 선분의 끝이 겹치는 경우는 끝점을 바로 리턴해준다.
  if (linePoint(x1, y1, x2, y2, x3, y3)) return [x3, y3];
  else if (linePoint(x1, y1, x2, y2, x4, y4)) return [x4, y4];
  else if (linePoint(x3, y3, x4, y4, x1, y1)) return [x1, y1];
  else if (linePoint(x3, y3, x4, y4, x2, y2)) return [x2, y2];

  // 선분 끝점이 겹치지 않는 경우만 체크한다.
  let A =
    ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  let B =
    ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  if (0 <= A && A <= 1 && 0 <= B && B <= 1) {
    return [x1 + A * (x2 - x1), y1 + A * (y2 - y1)];
  }

  return [];
}

/**
 *
 * 선과 사각형의 겹치는 지점 체크
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} rectX
 * @param {number} rectY
 * @param {number} width
 * @param {number} height
 */
export function lineRect(x1, y1, x2, y2, rectX, rectY, width, height) {
  const left = lineLine(x1, y1, x2, y2, rectX, rectY, rectX, rectY + height);
  const right = lineLine(
    x1,
    y1,
    x2,
    y2,
    rectX + width,
    rectY,
    rectX + width,
    rectY + height
  );
  const top = lineLine(x1, y1, x2, y2, rectX, rectY, rectX + width, rectY);
  const bottom = lineLine(
    x1,
    y1,
    x2,
    y2,
    rectX,
    rectY + height,
    rectX + width,
    rectY + height
  );

  return left || right || top || bottom;
}

/**
 *
 * 선과 사각형의 겹치는 지점 리스트
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} rectX
 * @param {number} rectY
 * @param {number} width
 * @param {number} height
 * @returns {vec3[]}
 */
export function getClosestPointBylineRect(
  x1,
  y1,
  x2,
  y2,
  rectX,
  rectY,
  width,
  height
) {
  const left = getClosestPointBylineLine(
    x1,
    y1,
    x2,
    y2,
    rectX,
    rectY,
    rectX,
    rectY + height
  );
  const right = getClosestPointBylineLine(
    x1,
    y1,
    x2,
    y2,
    rectX + width,
    rectY,
    rectX + width,
    rectY + height
  );
  const top = getClosestPointBylineLine(
    x1,
    y1,
    x2,
    y2,
    rectX,
    rectY,
    rectX + width,
    rectY
  );
  const bottom = getClosestPointBylineLine(
    x1,
    y1,
    x2,
    y2,
    rectX,
    rectY + height,
    rectX + width,
    rectY + height
  );

  const points = [];

  if (left.length) points.push(left);
  if (right.length) points.push(right);
  if (top.length) points.push(top);
  if (bottom.length) points.push(bottom);

  return points;
}

/**
 * 폴리곤에 점 비교
 *
 * @param {vec3[]} verties
 * @param {number} px
 * @param {number} py
 */
export function polyPoint(verties = [], px, py, withoutPoint = false) {
  let isCollision = false;

  const len = verties.length;
  if (withoutPoint === false) {
    for (let i = 0; i < len; i++) {
      const v1 = verties[i];
      const v2 = verties[(i + 1) % len];

      if (linePoint(v1[0], v1[1], v2[0], v2[1], px, py)) {
        isCollision = true;
        break;
      }
    }
  }

  if (isCollision) return true;

  verties.forEach((vector, index) => {
    const [cx, cy] = vector;
    const [nx, ny] = verties[(index + 1) % len];

    if (
      ((cy >= py && ny < py) || (cy < py && ny >= py)) &&
      px < ((nx - cx) * (py - cy)) / (ny - cy) + cx
    ) {
      isCollision = !isCollision;
    }
  });

  return isCollision;
}

export function polyCircle(verties = [], cx, cy, r) {
  const len = verties.length;
  const isCollision = verties.some((vector, index) => {
    const [currentX, currentY] = vector;
    const [nextX, nextY] = verties[(index + 1) % len];

    const collision = lineCircle(currentX, currentY, nextX, nextY, cx, cy, r);
    if (collision) return true;

    return false;
  });

  if (isCollision) return true;

  if (polyPoint(verties, cx, cy)) {
    return true;
  }

  return false;
}

export function polyRect(verties = [], rectX, rectY, rectWidth, rectHeight) {
  const len = verties.length;
  return verties.some((vector, index) => {
    const [currentX, currentY] = vector;
    const [nextX, nextY] = verties[(index + 1) % len];

    const collision = lineRect(
      currentX,
      currentY,
      nextX,
      nextY,
      rectX,
      rectY,
      rectWidth,
      rectHeight
    );
    if (collision) return true;

    const inside = polyPoint(verties, rectX, rectY);
    if (inside) return true;

    return false;
  });
}

export function polyLine(verties = [], x1, y1, x2, y2, withoutPoint = false) {
  const len = verties.length;
  return verties.some((vector, index) => {
    const [x3, y3] = vector;
    const [x4, y4] = verties[(index + 1) % len];

    if (withoutPoint) {
      return lineLineWithoutPoint(x1, y1, x2, y2, x3, y3, x4, y4);
    } else {
      return lineLine(x1, y1, x2, y2, x3, y3, x4, y4);
    }
  });
}

export function getClosestPointByPolyLine(verties = [], x1, y1, x2, y2) {
  const pointList = [];
  const len = verties.length;
  verties.forEach((vector, index) => {
    const [x3, y3] = vector;
    const [x4, y4] = verties[(index + 1) % len];

    const point = getClosestPointBylineLine(x1, y1, x2, y2, x3, y3, x4, y4);
    if (point.length) {
      pointList.push(point);
    }
  });

  return pointList;
}

/**
 * polygon 끼리 충돌 비교
 *
 *
 * @param {vec3[]} verties
 * @param {vec3[]} targetVerties
 * @param {boolean} [withoutPoint=false] 선분의 끝점도 충돌 계산에 넣을지 정의, false 이면 끝점 체크를 하고 , true 이면 끝점 체크를 하지 않는다.
 */
export function polyPoly(
  verties = [],
  targetVerties = [],
  withoutPoint = false
) {
  const len = verties.length;
  return verties.some((vector, index) => {
    const [x1, y1] = vector;
    const [x2, y2] = verties[(index + 1) % len];

    let collision = polyLine(targetVerties, x1, y1, x2, y2, withoutPoint);
    if (collision) return true;

    collision = polyPoint(
      verties,
      targetVerties[0][0],
      targetVerties[0][1],
      withoutPoint
    );
    if (collision) return true;

    return false;
  });
}

/**
 * sourceVerteis 가 targetVerties 에 모두 속하는지 확인
 *
 * @param {vec3[]} sourceVerties
 * @param {vec3[]} targetVerties
 */
export function polyInPoly(sourceVerties = [], targetVerties = []) {
  return sourceVerties.every((vector) => {
    return polyPoint(targetVerties, vector[0], vector[1]);
  });
}

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {string} origin
 * @returns {vec3[]}
 */
export function rectToVerties(x, y, width, height, origin = "50% 50% 0px") {
  const center = TransformOrigin.scale(origin, width, height);

  return [
    [x, y, 0], // top , left
    [x + width, y, 0], // top , right
    [x + width, y + height, 0], // bottom , right
    [x, y + height, 0], // bottom , left
    [x + center[0], y + center[1], 0], // transform origin
  ];
}

export function getRotatePointer(verties, dist = 0) {
  const topPointer = vec3.lerp([], verties[0], verties[1], 0.5);
  const bottomPointer = vec3.lerp([], verties[2], verties[3], 0.5);
  const rotatePointer = getPointBetweenVerties(bottomPointer, topPointer, dist);

  return rotatePointer;
}

export function rectToVertiesForArea(x, y, width, height) {
  return rectToVerties(x, y, width, height);
}

export function itemsToRectVerties(items = []) {
  let minX = Number.MAX_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;

  const xList = [];
  const yList = [];

  items.forEach((item) => {
    item.originVerties.forEach((vector) => {
      xList.push(vector[0]);
      yList.push(vector[1]);
    });
  });

  minX = Math.min.apply(Math, xList);
  maxX = Math.max.apply(Math, xList);
  minY = Math.min.apply(Math, yList);
  maxY = Math.max.apply(Math, yList);

  if (minX === Number.MAX_SAFE_INTEGER) minX = 0;
  if (minY === Number.MAX_SAFE_INTEGER) minY = 0;
  if (maxX === Number.MIN_SAFE_INTEGER) maxX = 0;
  if (maxY === Number.MIN_SAFE_INTEGER) maxY = 0;

  return rectToVerties(minX, minY, maxX - minX, maxY - minY);
}

export function targetItemsToRectVerties(items = []) {
  let minX = Number.MAX_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;

  const xList = [];
  const yList = [];

  items.forEach((item) => {
    item.targetVerties.forEach((vector) => {
      xList.push(vector[0]);
      yList.push(vector[1]);
    });
  });

  minX = Math.min.apply(Math, xList);
  maxX = Math.max.apply(Math, xList);
  minY = Math.min.apply(Math, yList);
  maxY = Math.max.apply(Math, yList);

  if (minX === Number.MAX_SAFE_INTEGER) minX = 0;
  if (minY === Number.MAX_SAFE_INTEGER) minY = 0;
  if (maxX === Number.MIN_SAFE_INTEGER) maxX = 0;
  if (maxY === Number.MIN_SAFE_INTEGER) maxY = 0;

  return rectToVerties(minX, minY, maxX - minX, maxY - minY);
}

/**
 * verties -> rect
 *
 * @param {vec3[]} verties
 * @param {boolean} [hasLength=true]
 * @returns {Rect} rectangle
 */
export function vertiesToRectangle(verties) {
  const x = verties[0][0];
  const y = verties[0][1];
  const width = vec3.dist(verties[0], verties[1]);
  const height = vec3.dist(verties[0], verties[3]);

  return new Rect(x, y, width, height);
}

/**
 * verties 를 path 로 변경
 *
 * @param {vec3[]} verties
 * @returns
 */
export function vertiesToPath(verties = []) {
  const results = [];

  for (var i = 0; i < verties.length; i++) {
    if (i === 0) {
      results.push(`M ${verties[i][0]} ${verties[i][1]}`);
    } else {
      results.push(`L ${verties[i][0]} ${verties[i][1]}`);
    }
  }

  if (results.length) {
    results.push("Z");
  }

  return results.join(" ");
}

export function toRectVertiesWithoutTransformOrigin(verties) {
  return toRectVerties(verties).filter((it, index) => {
    return index < 4;
  });
}

export function toRectVerties(verties) {
  let minX = Number.MAX_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;

  const xList = [];
  const yList = [];

  verties.forEach((vector) => {
    xList.push(vector[0]);
    yList.push(vector[1]);
  });

  minX = Math.min.apply(Math, xList);
  maxX = Math.max.apply(Math, xList);
  minY = Math.min.apply(Math, yList);
  maxY = Math.max.apply(Math, yList);

  if (minX === Number.MAX_SAFE_INTEGER) minX = 0;
  if (minY === Number.MAX_SAFE_INTEGER) minY = 0;
  if (maxX === Number.MIN_SAFE_INTEGER) maxX = 0;
  if (maxY === Number.MIN_SAFE_INTEGER) maxY = 0;

  return rectToVerties(minX, minY, maxX - minX, maxY - minY);
}
