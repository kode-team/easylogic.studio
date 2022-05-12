import { vec3 } from "gl-matrix";

import { getClosestPointBylineLine } from "./collision";
import { getDist } from "./math";

export const predefinedBezier = {
  linear: true,
  ease: true,
  "ease-in": true,
  "ease-out": true,
  "ease-in-out": true,
};

export const bezierObj = {
  ease: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  "ease-in": "cubic-bezier(0.42, 0, 1, 1)",
  "ease-out": "cubic-bezier(0, 0, 0.58, 1)",
};

export const bezierList = [
  [0, 0, 1, 1, "linear", true],
  [0.25, 0.1, 0.25, 1, "ease", true],
  [0.42, 0, 1, 1, "ease-in", true],
  [0, 0, 0.58, 1, "ease-out", true],
  [0.47, 0, 0.745, 0.715, "ease-in-sine"],
  [0.39, 0.575, 0.565, 1, "ease-out-sine"],
  [0.445, 0.05, 0.55, 0.95, "ease-in-out-sine"],
  [0.55, 0.085, 0.68, 0.53, "ease-in-quad"],
  [0.25, 0.46, 0.45, 0.94, "ease-out-quad"],
  [0.455, 0.03, 0.515, 0.955, "ease-in-out-quad"],
  [0.55, 0.055, 0.675, 0.19, "ease-in-cubic"],
  [0.215, 0.61, 0.355, 1, "ease-out-cubic"],
  [0.645, 0.045, 0.355, 1, "ease-in-out-cubic"],
  [0.895, 0.03, 0.685, 0.22, "ease-in-quart"],
  [0.165, 0.84, 0.44, 1, "ease-out-quart"],
  [0.77, 0, 0.175, 1, "ease-in-out-quart"],
  [0.6, 0.04, 0.98, 0.335, "ease-in-circ"],
  [0.075, 0.82, 0.165, 1, "ease-out-circ"],
  [0.785, 0.135, 0.15, 0.86, "ease-in-out-circ"],
  [0.95, 0.05, 0.795, 0.035, "ease-in-expo"],
  [0.19, 1, 0.22, 1, "ease-out-expo"],
  [1, 0, 0, 1, "ease-in-out-expo"],
  [0.755, 0.05, 0.855, 0.06, "ease-in-quint"],
  [0.23, 1, 0.32, 1, "ease-out-quint"],
  [0.86, 0, 0.07, 1, "ease-in-out-quint"],
  [0.6, -0.28, 0.735, 0.045, "ease-in-back"],
  [0.175, 0.885, 0.32, 1.275, "ease-out-back"],
  [0.68, -0.55, 0.265, 1.55, "ease-in-out-back"],
];

export const getPredefinedCubicBezier = (str) => {
  return [...parseCubicBezier(bezierObj[str] || str)];
};

export const formatCubicBezier = (arr) => {
  arr = arr.map((it) => Math.floor(it * 100) / 100);

  for (var i = 0, len = bezierList.length; i < len; i++) {
    var bezier = bezierList[i];

    if (
      bezier[0] == arr[0] &&
      bezier[1] == arr[1] &&
      bezier[2] == arr[2] &&
      bezier[3] == arr[3] &&
      bezier[5] /* is support css timing function name */
    ) {
      return bezier[4]; // timing function name
    }
  }

  return `cubic-bezier( ${arr.filter((_, index) => index < 4).join(",")} )`;
};

export function parseCubicBezier(str) {
  if (typeof str == "string") {
    if (predefinedBezier[str]) {
      return bezierList.filter((it) => it[4] === str)[0];
    } else {
      var arr = str
        .replace("cubic-bezier", "")
        .replace("(", "")
        .replace(")", "")
        .split(",");
      arr = arr.map((it) => parseFloat(it.trim()));
      return arr;
    }
  }

  return str;
}

export const calc = {
  B1: function (t) {
    return t * t * t;
  },
  B2: function (t) {
    return 3 * t * t * (1 - t);
  },
  B3: function (t) {
    return 3 * t * (1 - t) * (1 - t);
  },
  B4: function (t) {
    return (1 - t) * (1 - t) * (1 - t);
  },
};

export const createBezier = (C1, C2, C3, C4) => {
  var points = [C1, C2, C3, C4];
  return function (t) {
    return getBezierPointOne(points, t);
  };
};

export const createBezierQuard = (C1, C2, C3) => {
  var points = [C1, C2, C3];
  return function (t) {
    return getBezierPointOneQuard(points, t);
  };
};

export const createBezierLine = (C1, C2) => {
  var points = [C1, C2];
  return function (t) {
    return getBezierPointOneLine(points, t);
  };
};

const checkDist = (obj, curve, t, x, y) => {
  var p = curve(t);
  var dist = getDist(x, y, p.x, p.y);

  if (dist < obj.minDist) {
    obj.minDist = dist;
    obj.minT = t;
  }
};

export const getPolygonalDist = (points = []) => {
  let total = 0;
  //   let len = points.length;

  points.forEach((point, index) => {
    var next = points[index + 1];

    if (!next) {
      return;
    }

    var dist = vec3.dist(
      vec3.fromValues(point.x, point.y, 0),
      vec3.fromValues(next.x, next.y, 0)
    );
    total += dist;
  });

  return total;
};

export const getCurveDist = (
  sx,
  sy,
  cx1,
  cy1,
  cx2,
  cy2,
  ex,
  ey,
  count = 1000
) => {
  var curve = createBezier(
    { x: sx, y: sy },
    { x: cx1, y: cy1 },
    { x: cx2, y: cy2 },
    { x: ex, y: ey }
  );

  var total = 0;
  var startPoint = curve(0);
  for (var i = 0; i <= count; i++) {
    var t = i / count;
    var xy = curve(t);

    total += getDist(startPoint.x, startPoint.y, xy.x, xy.y);
    startPoint = xy;
  }

  return total;
};

export const getQuardDist = (sx, sy, cx1, cy1, ex, ey, count = 1000) => {
  var curve = createBezierQuard(
    { x: sx, y: sy },
    { x: cx1, y: cy1 },
    { x: ex, y: ey }
  );

  var total = 0;
  var startPoint = curve(0);
  for (var i = 0; i <= count; i++) {
    var t = i / count;
    var xy = curve(t);

    total += getDist(startPoint.x, startPoint.y, xy.x, xy.y);
    startPoint = xy;
  }

  return total;
};

const makeCurveFunction = (curve, count = 10) => {
  var obj = {
    minDist: Infinity,
    minT: 0,
  };
  return function (x, y) {
    for (var i = 0; i <= count; i++) {
      checkDist(obj, curve, i / count, x, y);
    }

    var step = 1 / (count * 2);
    var t = obj.minT;
    for (var i = 0; i < count; i++) {
      checkDist(obj, curve, Math.max(0, t - step), x, y);
      checkDist(obj, curve, Math.min(1, t + step), x, y);
      step /= 2;
    }

    return obj.minT;
  };
};

export const recoverBezier = (C1, C2, C3, C4, count = 20) => {
  return makeCurveFunction(createBezier(C1, C2, C3, C4), count);
};

export const recoverBezierQuard = (C1, C2, C3, count = 20) => {
  return makeCurveFunction(createBezierQuard(C1, C2, C3), count);
};

export const recoverBezierLine = (C1, C2, count = 20) => {
  return makeCurveFunction(createBezierLine(C1, C2), count);
};

export const createBezierForPattern = (bezierString) => {
  if (bezierString === "linear") {
    var C1 = { x: 0, y: 0 };
    var C2 = { x: 1, y: 1 };
    return createBezierLine(C1, C2);
  }

  var bezierList = parseCubicBezier(bezierString);

  var C1 = { x: 0, y: 0 };
  var C2 = { x: bezierList[0], y: bezierList[1] };
  var C3 = { x: bezierList[2], y: bezierList[3] };
  var C4 = { x: 1, y: 1 };

  return createBezier(C1, C2, C3, C4);
};

const interpolate = (p1, p2, t) => {
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t,
  };
};

export const getBezierPointOne = (points, t) => {
  var p0 = interpolate(points[0], points[1], t);
  var p1 = interpolate(points[1], points[2], t);
  var p2 = interpolate(points[2], points[3], t);
  var p3 = interpolate(p0, p1, t);
  var p4 = interpolate(p1, p2, t);

  return interpolate(p3, p4, t);
};

export const getBezierPointOneQuard = (points, t) => {
  var p0 = interpolate(points[0], points[1], t);
  var p1 = interpolate(points[1], points[2], t);
  return interpolate(p0, p1, t);
};

export const getBezierPointOneLine = (points, t) => {
  return interpolate(points[0], points[1], t);
};

export const getBezierPoints = (points, t) => {
  var p0 = interpolate(points[0], points[1], t);
  var p1 = interpolate(points[1], points[2], t);
  var p2 = interpolate(points[2], points[3], t);
  var p3 = interpolate(p0, p1, t);
  var p4 = interpolate(p1, p2, t);
  var p5 = interpolate(p3, p4, t);

  return {
    first: [points[0], p0, p3, p5],
    second: [p5, p4, p2, points[3]],
  };
};

export const getBezierPointsQuard = (points, t) => {
  var p0 = interpolate(points[0], points[1], t);
  var p1 = interpolate(points[1], points[2], t);
  var p2 = interpolate(p0, p1, t);

  return {
    first: [points[0], p0, p2],
    second: [p2, p1, points[2]],
  };
};

export const splitBezierPointsByCount = (points, count = 1) => {
  var result = [];

  while (count > 0) {
    const curve = getBezierPoints(points, 1 / count);
    result.push(curve.first);
    points = curve.second;
    count--;
  }

  return result;
};

export const splitBezierPointsQuardByCount = (points, count = 1) => {
  var result = [];

  while (count > 0) {
    const curve = getBezierPointsQuard(points, 1 / count);
    result.push(curve.first);
    points = curve.second;
    count--;
  }

  return result;
};

export const splitBezierPointsLineByCount = (points, count = 1) => {
  var result = [];
  const unit = 1 / count;

  while (count > 0) {
    const curve = getBezierPointsLine(points, unit);
    result.push(curve.first);
    points = curve.second;
    count--;
  }

  return result;
};

export const getBezierPointsLine = (points, t) => {
  var p0 = interpolate(points[0], points[1], t);

  return {
    first: [points[0], p0],
    second: [p0, points[1]],
  };
};

/**
 * convert line to bezier curve
 *
 * @param {vec3[]} points
 * @returns {vec3[]}
 */
export const normalizeCurveForLine = (points) => {
  return [
    vec3.clone(points[0]),
    [
      points[0][0] + (points[1][0] - points[0][0]) * 0.33,
      points[0][1] + (points[1][1] - points[0][1]) * 0.33,
      0,
    ],
    [
      points[0][0] + (points[1][0] - points[0][0]) * 0.66,
      points[0][1] + (points[1][1] - points[0][1]) * 0.66,
      0,
    ],
    vec3.clone(points[1]),
  ];
};

/**
 * convert quadratic bezier curve to bezier curve
 *
 * @param {vec3[]} points
 * @returns {vec3[]}
 */
export const normalizeCurveForQuard = (points) => {
  const twoOfThree = 2 / 3;

  return [
    vec3.clone(points[0]),

    vec3.fromValues(
      // C1 = Q0 + (2/3) (Q1 - Q0)
      points[0][0] + twoOfThree * (points[1][0] - points[0][0]),
      points[0][1] + twoOfThree * (points[1][1] - points[0][1]),
      0
    ),

    vec3.fromValues(
      // C2 = Q2 + (2/3) (Q1 - Q2)
      points[2][0] + twoOfThree * (points[1][0] - points[2][0]),
      points[2][1] + twoOfThree * (points[1][1] - points[2][1]),
      0
    ),

    vec3.clone(points[2]),
  ];
};

/**
 * curve 의 length 를 기반으로 polygon 을 만든다.
 *
 * 샘플링을 10개부터 시작해서 길이의 차이가 0.25보다 작아질 때까지 계속 샘플링을 증가시킨다.
 *
 * @param {vec3} c1
 * @param {vec3} c2
 * @param {vec3} c3
 * @param {vec3} c4
 * @param {number} count
 * @returns {vec3[]}
 */
export const polygonalForCurve = (c1, c2, c3, c4, count = 1000) => {
  const totalLength = getCurveDist(
    c1[0],
    c1[1],
    c2[0],
    c2[1],
    c3[0],
    c3[1],
    c4[0],
    c4[1],
    count
  );

  let samplingCount = 10;
  let samplingStep = totalLength / samplingCount;
  let lastLength = 0;
  let points = [];

  const bezierPoints = [c1, c2, c3, c4].map((point) => ({
    x: point[0],
    y: point[1],
  }));

  do {
    points = [];
    let currentLength = 0;

    for (let i = 0; i <= samplingCount; i++) {
      const nextPoint = getBezierPointOne(
        bezierPoints,
        currentLength / totalLength
      );
      points.push(nextPoint);
      currentLength += samplingStep;
    }

    lastLength = getPolygonalDist(points);

    samplingCount += (samplingCount * (totalLength - lastLength)) / totalLength;
    samplingStep = totalLength / samplingCount;
  } while (totalLength - lastLength > 0.25);

  return points.map((point) => vec3.fromValues(point.x, point.y, 0));
};

export const calculateA = (points) => {
  // a = 3 * (-p0 + 3*p1 - 3*p2 + p3)
  const a1 = vec3.negate([], points[0]);
  const a2 = vec3.multiply([], [3, 3, 3], points[1]);
  const a3 = vec3.multiply([], [-3, -3, -3], points[2]);
  const a4 = points[3];

  const newP = vec3.add([], vec3.add([], a1, a2), vec3.add([], a3, a4));

  return vec3.multiply([], [3, 3, 3], newP);
};

export const calculateB = (points) => {
  // b = 6 * (p0 - 2*p1 + p2);
  const b1 = points[0];
  const b2 = vec3.multiply([], [-2, -2, -2], points[1]);
  const b3 = points[2];

  const newP = vec3.add([], vec3.add([], b1, b2), b3);

  return vec3.multiply([], [6, 6, 6], newP);
};

export const calculateC = (points) => {
  // c = 3 * (p1 - p0);
  const newP = vec3.add([], points[1], vec3.negate([], points[0]));

  return vec3.multiply([], [3, 3, 3], newP);
};

export const findRootForCurve = (points) => {
  // Vector2 a = 3 * (-p0 + 3*p1 - 3*p2 + p3);
  // Vector2 b = 6 * (p0 - 2*p1 + p2);
  //Vector2 c = 3 * (p1 - p0);

  const a = calculateA(points);
  const b = calculateB(points);
  const c = calculateC(points);

  const roots = [];

  // x
  const distX = b[0] * b[0] - 4 * a[0] * c[0];
  if (distX < 0) {
    // NOOP
  } else if (distX === 0) {
    let rootX = -b[0] / (2 * a[0]);
    if (isNaN(rootX)) rootX = 0;

    if (0 <= rootX && rootX <= 1) {
      roots.push(rootX);
    }
  } else if (distX > 0) {
    const rootX1 = (-b[0] + Math.sqrt(distX)) / (2 * a[0]);
    const rootX2 = (-b[0] - Math.sqrt(distX)) / (2 * a[0]);

    if (0 <= rootX1 && rootX1 <= 1) {
      roots.push(rootX1);
    }

    if (0 <= rootX2 && rootX2 <= 1) {
      roots.push(rootX2);
    }
  }

  // y
  const distY = b[1] * b[1] - 4 * a[1] * c[1];

  if (distY < 0) {
    // NOOP
  } else if (distY === 0) {
    let rootY = -b[1] / (2 * a[1]);
    if (isNaN(rootY)) rootY = 0;

    if (0 <= rootY && rootY <= 1) {
      roots.push(rootY);
    }
  } else if (distY > 0) {
    const rootY1 = (-b[1] + Math.sqrt(distY)) / (2 * a[1]);
    const rootY2 = (-b[1] - Math.sqrt(distY)) / (2 * a[1]);

    if (0 <= rootY1 && rootY1 <= 1) {
      roots.push(rootY1);
    }

    if (0 <= rootY2 && rootY2 <= 1) {
      roots.push(rootY2);
    }
  }

  return roots;
};

/**
 * get bezier curve bounding box
 * 벡터 배열 넘기기
 *
 * @param {vec3[]} points
 */
export const getCurveBBox = (points) => {
  const roots = findRootForCurve(points);

  const xyPoints = points.map((p) => {
    return { x: p[0], y: p[1] };
  });

  // root 에 t = 0, 1 을 항상 넣어준다.
  roots.push(0, 1);

  return roots.map((t) => {
    const { x, y } = getBezierPointOne(xyPoints, t);
    return [x, y, 0];
  });
};

// export const getQuardCurveBBox = (points) => {
//   const roots = findRootForQuardCurve(points);

//   const xyPoints = points.map((p) => {
//     return { x: p[0], y: p[1] };
//   });

//   return roots.map((t) => {
//     const { x, y } = getBezierPointOneQuard(xyPoints, t);
//     return [x, y, 0];
//   });
// };

/**
 *
 * @typedef Point
 * @type {object}
 *
 * @property {number} x
 * @property {number} y
 */

/**
 *
 * @typedef Curve
 * @type {Point[]}
 */

/**
 * direction (top -> right -> bottom -> left)
 *
 * @param {Curve[]} bezierCurveList
 * @param {*} tList
 */
export const getPointInCurveList = (bezierCurveList = [], tList = []) => {
  const results = bezierCurveList.map((curve, index) => {
    const t = tList[index];

    const resultPoint = getBezierPointOne(curve, t);

    return resultPoint;
  });

  const v1 = [results[0], results[2]];

  const v2 = [results[1], results[3]];

  return getClosestPointBylineLine(
    v1[0].x,
    v1[0].y,
    v1[1].x,
    v1[1].y,
    v2[0].x,
    v2[0].y,
    v2[1].x,
    v2[1].y
  );
};
