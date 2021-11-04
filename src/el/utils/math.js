import { mat4, vec2, vec3 } from "gl-matrix";

export function round(n, k) {
    k = typeof k === 'undefined' ? 1 : k;
    return Math.round(n * k) / k;
}


export function degreeToRadian(degrees) {
    return degrees * (Math.PI / 180);
}

export function div(num, divNum = 1) {
    return (num === 0) ? 0 : num / divNum;
}

/**
 * 
 * convert radian to degree 
 * 
 * @param {*} radian 
 * @returns {Number} 0..360
 */
export function radianToDegree(radian) {
    var angle = radian * (180 / Math.PI);


    if (angle < 0) {
        angle = 360 + angle
    }

    return angle;
}


export function getXInCircle(angle, radius, centerX = 0) {
    return centerX + radius * Math.cos(degreeToRadian(angle))
}

export function getYInCircle(angle, radius, centerY = 0) {
    return centerY + radius * Math.sin(degreeToRadian(angle))
}

export function getXYInCircle(angle, radius, centerX = 0, centerY = 0) {
    return {
        x: getXInCircle(angle, radius, centerX),
        y: getYInCircle(angle, radius, centerY)
    }
}

export function getDist(x, y, centerX = 0, centerY = 0) {
    return vec2.distance([x, y], [centerX, centerY])
}

/**
 * 
 * start 벡터에서 end 벡터로 이어질 때  
 * end에서 pointDist 만큼의 거리를 이동한 벡터를 구한다. 
 * 
 * @param {vec3} start 
 * @param {vec3} end 
 * @param {number} pointDist 
 */
export function getPointBetweenVerties(start, end, pointDist = 0) {
    return vec3.lerp([], start, end, 1 + pointDist / vec3.dist(start, end))
}

export function vertiesMap(verties, transformView) {

    if (verties.length === 1) {
        return [
            vec3.transformMat4([], verties[0], transformView),
        ]
    } else if (verties.length === 2) {
        return [
            vec3.transformMat4([], verties[0], transformView),
            vec3.transformMat4([], verties[1], transformView),
        ]
    } else if (verties.length === 3) {
        return [
            vec3.transformMat4([], verties[0], transformView),
            vec3.transformMat4([], verties[1], transformView),
            vec3.transformMat4([], verties[2], transformView),
        ]
    } else if (verties.length === 4) {
        return [
            vec3.transformMat4([], verties[0], transformView),
            vec3.transformMat4([], verties[1], transformView),
            vec3.transformMat4([], verties[2], transformView),
            vec3.transformMat4([], verties[3], transformView),
        ]
    } else if (verties.length === 5) {
        return [
            vec3.transformMat4([], verties[0], transformView),
            vec3.transformMat4([], verties[1], transformView),
            vec3.transformMat4([], verties[2], transformView),
            vec3.transformMat4([], verties[3], transformView),
            vec3.transformMat4([], verties[4], transformView),
        ]
    }

    return verties.map(v => {
        return vec3.transformMat4([], v, transformView)
    });
}

function getTargetPointX(source, target, axis, nextTarget) {
    return [
        source, 
        [target[0], source[1], target[2]], 
        axis, 
        Math.abs(source[0] - target[0]), 
        nextTarget
    ];
}

function getTargetPointY(source, target, axis, nextTarget) {
    return [
        [target[0], source[1], source[2]], 
        target, 
        axis, 
        Math.abs(source[1] - target[1]), 
        nextTarget
    ];
}    

function invertTargetPoint(arr, isInvert = false) {
    if (isInvert === false) return arr;

    const [source, target, axis, dist, newTarget, sourceVerties, targetVerties] = arr; 

    if (newTarget) {
        return [
            [target[0], newTarget[1], target[2]],             
            [source[0], newTarget[1], source[2]], 
            axis, dist, 
            [source[0], source[1], newTarget[2]],
            sourceVerties, 
            targetVerties,
            isInvert
        ]
    } else {
        return [
            target, 
            source, 
            axis, 
            dist, 
            newTarget, 
            sourceVerties, 
            targetVerties,
            isInvert
        ]
    }

}

/**
 * 가이드 
 * 
 * @param {vec3[]} sourceVerties 
 * @param {vec3[]} targetVerties
 * 
 * @returns {Array} [source, target, axis, dist, newTarget] 
 */
export function makeGuidePoint (sourceVerties, targetVerties) {

    let leftVerties = sourceVerties;
    let rightVerties = targetVerties;
    let hasInvert = false; 
    if (sourceVerties[4][0] - targetVerties[4][0] > 0) {
        leftVerties = targetVerties;
        rightVerties = sourceVerties;
        hasInvert = true; 
    }

    // x 구하기 
    const leftCenter = vec3.lerp([], leftVerties[1], leftVerties[2], 0.5);
    const rightCenter = vec3.lerp([], rightVerties[0], rightVerties[3], 0.5);

    let pointList = [];

    if (rightVerties[0][1] <= leftCenter[1] && leftCenter[1] <= rightVerties[3][1]) {
        pointList.push(getTargetPointX(leftCenter, rightCenter, "x", null))
    } else if (rightVerties[0][1] <= leftVerties[1][1]) {
        if (rightVerties[3][0] <= leftVerties[1][0] && leftVerties[1][0] <= rightVerties[2][0]) {
            pointList.push(getTargetPointY(rightVerties[3], [rightVerties[3][0], leftVerties[1][1], leftVerties[1][2]], "y", null))
        } else {
            pointList.push(getTargetPointX(leftVerties[1], rightCenter, "x", rightVerties[3]))
        }

    } else if (leftVerties[3][0] <= rightVerties[0][0] && rightVerties[0][0] <= leftVerties[2][0]) {
        pointList.push(getTargetPointY(leftVerties[3], rightVerties[0], "y"))
    } else if (rightVerties[3][0] <= leftVerties[0][0] && leftVerties[0][0] <= rightVerties[2][0]) {      
        pointList.push(getTargetPointY([rightVerties[0][0],leftVerties[3][1], leftVerties[3][2] ], rightVerties[0], "y"))
    } else if (rightVerties[3][0] <= leftVerties[1][0] && leftVerties[1][0] <= rightVerties[2][0]) {
        pointList.push(getTargetPointY(rightVerties[3], [rightVerties[3][0], leftVerties[1][1], leftVerties[1][2]], "y"))
    } else {
        pointList.push(getTargetPointX(leftVerties[2], rightCenter, "x", rightVerties[0]))
    }

    pointList.sort((a, b) => {
        return a[3] - b[3];
    });

    return invertTargetPoint([
        ...pointList[0],
        sourceVerties,
        targetVerties,
    ], hasInvert);
}


export function getVertiesMaxX(verties) {
    let maxValue = Number.MIN_SAFE_INTEGER;
    verties.forEach(v => {
        maxValue = Math.max(v[0], maxValue)
    })

    return maxValue;
}

export function getVertiesMaxY(verties) {
    let maxValue = Number.MIN_SAFE_INTEGER;
    verties.forEach(v => {
        maxValue = Math.max(v[1], maxValue)
    })

    return maxValue;
}

export function getVertiesMinX(verties) {
    let maxValue = Number.MAX_SAFE_INTEGER;
    verties.forEach(v => {
        maxValue = Math.min(v[0], maxValue)
    })

    return maxValue;
}

export function getVertiesCenterX(verties) {
    let minX = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    verties.forEach(v => {
        minX = Math.min(v[0], minX)
        maxX = Math.max(v[0], maxX)
    })

    return Math.round((minX + maxX) / 2);
}

export function getVertiesMinY(verties) {
    let maxValue = Number.MAX_SAFE_INTEGER;
    verties.forEach(v => {
        maxValue = Math.min(v[1], maxValue)
    })

    return maxValue;
}


export function getVertiesCenterY(verties) {
    let minY = Number.MAX_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;
    verties.forEach(v => {
        minY = Math.min(v[1], minY)
        maxY = Math.max(v[1], maxY)
    })

    return Math.round((minY + maxY) / 2);
}


export function calculateAngle(rx, ry) {
    return radianToDegree(Math.atan2(ry, rx))
}

/**
 * center 를 기준으로 point 에서 dist 만큼 이동한 후 angle 를 구함 
 * 
 * @param {vec3} point 
 * @param {vec3} center 
 * @param {vec3} dist 
 */
export function calculateAngleForVec3(point, center, dist) {
    return calculateAnglePointDistance(
        { x: point[0], y: point[1] },
        { x: center[0], y: center[1] },   // origin 
        { dx: dist[0], dy: dist[1] }
    )
}

export function calculateRotationOriginMat4(angle, origin) {
    const view = mat4.create();
    mat4.translate(view, view, origin);    // move origin 
    mat4.rotateZ(view, view, degreeToRadian(angle));    // rotate
    mat4.translate(view, view, vec3.negate([], origin));    // move origin * -1  

    return view;
}

export function calculateMatrix(...args) {
    const view = mat4.create();
    args.forEach(v => {
        mat4.multiply(view, view, v);
    })

    return view;
}

export function calculateMatrixInverse(...args) {
    return mat4.invert([], calculateMatrix(...args));
}

export function calculateAnglePointDistance(point, center, dist) {
    var x = point.x - center.x
    var y = point.y - center.y

    var angle1 = calculateAngle(x, y);

    var x2 = point.x + dist.dx - center.x
    var y2 = point.y + dist.dy - center.y

    var angle = calculateAngle(x2, y2) - angle1;

    return angle;
}

export function calculateAngle360(rx, ry) {
    return (calculateAngle(rx, ry) + 180) % 360
}

const UUID_REG = /[xy]/g

export function uuid() {
    var dt = new Date().getTime();
    var uuid = 'xxx12-xx-34xx'.replace(UUID_REG, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

export function uuidShort() {
    var dt = new Date().getTime();
    var uuid = 'idxxxxxxx'.replace(UUID_REG, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

const bezierCalc = {
    B1: function (t) { return t * t * t },
    B2: function (t) { return 3 * t * t * (1 - t) },
    B3: function (t) { return 3 * t * (1 - t) * (1 - t) },
    B4: function (t) { return (1 - t) * (1 - t) * (1 - t) }
}

export function cubicBezier(x1, y1, x2, y2) {
    var C1 = { x: 0, y: 0 };
    var C2 = { x: x1, y: y1 };
    var C3 = { x: x2, y: y2 };
    var C4 = { x: 1, y: 1 };

    return function (progress) {
        // var x = C1.x * bezierCalc.B1(p) + C2.x*bezierCalc.B2(p) + C3.x*bezierCalc.B3(p) + C4.x*bezierCalc.B4(p);
        // var y = C1.y * bezierCalc.B1(progress) + C2.y*bezierCalc.B2(progress) + C3.y*bezierCalc.B3(progress) + C4.y*bezierCalc.B4(progress);

        var y = C2.y * bezierCalc.B2(progress) + C3.y * bezierCalc.B3(progress) + bezierCalc.B4(progress);

        return 1 - y;
    }
}

export function getGradientLine(angle, box) {
    let length = Math.abs(box.width * Math.sin(angle)) + Math.abs(box.height * Math.cos(angle));
    let center = {
        x: box.x + box.width / 2,
        y: box.y + box.height / 2
    };

    let yDiff = Math.sin(angle - Math.PI / 2) * length / 2;
    let xDiff = Math.cos(angle - Math.PI / 2) * length / 2;

    return {
        length,
        center,
        start: {
            x: center.x - xDiff,
            y: center.y - yDiff
        },
        end: {
            x: center.x + xDiff,
            y: center.y + yDiff
        }
    };
}


export function getCenterInTriangle(a, b, c) {
    return {
        x: (a.x + b.x + c.x) / 3,
        y: (a.y + b.y + c.y) / 3
    }
}

const splitReg = /[\b\t \,\n]/g;
export function normalize(str) {
    return str.trim().split(splitReg).filter(it => it).map(it => +it);
}