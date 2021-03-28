import { mat4, vec2, vec3 } from "gl-matrix";
import { isUndefined } from "./func";
import { Vect3 } from "./matrix";

export function round (n, k) {
    k = isUndefined(k) ? 1 : k; 
    return Math.round(n * k) / k;
}


export function degreeToRadian (degrees) {
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
    var angle =  radian * (180 / Math.PI);


    if (angle < 0) {   
        angle = 360 + angle
    }

    return angle; 
}


export function getXInCircle (angle, radius, centerX = 0) {
    return centerX + radius * Math.cos(degreeToRadian (angle))
}

export function getYInCircle (angle, radius, centerY = 0) {
    return centerY + radius * Math.sin(degreeToRadian(angle))
}    

export function getXYInCircle (angle, radius, centerX = 0, centerY = 0) {
    return {
        x : getXInCircle(angle, radius, centerX),
        y : getYInCircle(angle, radius, centerY)
    }
}

export function getDist (x, y, centerX = 0, centerY = 0) {
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
    return vec3.lerp([], start, end, 1 + pointDist/vec3.dist(start, end))
}

export function vertiesMap (verties, transformView) {
    return verties.map(v => {
        return vec3.transformMat4([], v, transformView); 
    })
}

export function getVertiesMaxX (verties) {
    let maxValue = Number.MIN_SAFE_INTEGER;
    verties.forEach(v =>{
        maxValue = Math.max(v[0], maxValue)
    })

    return maxValue;
}

export function getVertiesMaxY (verties) {
    let maxValue = Number.MIN_SAFE_INTEGER;
    verties.forEach(v =>{
        maxValue = Math.max(v[1], maxValue)
    })

    return maxValue;
}

export function getVertiesMinX (verties) {
    let maxValue = Number.MAX_SAFE_INTEGER;
    verties.forEach(v =>{
        maxValue = Math.min(v[0], maxValue)
    })

    return maxValue;
}

export function getVertiesCenterX (verties) {
    let minX = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    verties.forEach(v =>{
        minX = Math.min(v[0], minX)
        maxX = Math.max(v[0], maxX)
    })

    return Math.round((minX + maxX)/2);
}

export function getVertiesMinY (verties) {
    let maxValue = Number.MAX_SAFE_INTEGER;
    verties.forEach(v =>{
        maxValue = Math.min(v[1], maxValue)
    })

    return maxValue;
}


export function getVertiesCenterY (verties) {
    let minY = Number.MAX_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;
    verties.forEach(v =>{
        minY = Math.min(v[1], minY)
        maxY = Math.max(v[1], maxY)
    })

    return Math.round((minY + maxY)/2);
}


export function calculateAngle (rx, ry) {
    return radianToDegree(Math.atan2(ry, rx))    
}

/**
 * center 를 기준으로 point 에서 dist 만큼 이동한 후 angle 를 구함 
 * 
 * @param {vec3} point 
 * @param {vec3} center 
 * @param {vec3} dist 
 */
export function calculateAngleForVec3 (point, center, dist) {
    return calculateAnglePointDistance( 
        {x: point[0], y : point[1] },
        {x: center[0], y : center[1] },   // origin 
        {dx: dist[0], dy: dist[1]}
    )
}

export function calculateRotationOriginMat4 (angle, origin) {
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

export function calculateAngle360 (rx, ry) {
    return (calculateAngle(rx, ry) + 180) % 360
}

const UUID_REG = /[xy]/g

export function uuid(){
    var dt = new Date().getTime();
    var uuid = 'xxx12-xx-34xx'.replace(UUID_REG, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

export function uuidShort(){
    var dt = new Date().getTime();
    var uuid = 'idxxxxxxx'.replace(UUID_REG, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

const bezierCalc = {
    B1 : function (t) { return t*t*t },
    B2 : function (t) { return 3*t*t*(1-t) },
    B3 : function (t) { return 3*t*(1-t)*(1-t) },
    B4 : function (t) { return (1-t)*(1-t)*(1-t) }
}

export function cubicBezier (x1, y1, x2, y2) {
    var C1 = { x : 0, y : 0 };
    var C2 = { x : x1, y : y1 };
    var C3 = { x : x2, y : y2 };
    var C4 = { x : 1, y : 1 };

    return function (progress) {
        // var x = C1.x * bezierCalc.B1(p) + C2.x*bezierCalc.B2(p) + C3.x*bezierCalc.B3(p) + C4.x*bezierCalc.B4(p);
        // var y = C1.y * bezierCalc.B1(progress) + C2.y*bezierCalc.B2(progress) + C3.y*bezierCalc.B3(progress) + C4.y*bezierCalc.B4(progress);

        var y = C2.y*bezierCalc.B2(progress) + C3.y*bezierCalc.B3(progress) + bezierCalc.B4(progress);

        return 1 - y;
    }
}

export function getGradientLine(angle, box) {
    let length = Math.abs(box.width * Math.sin(angle)) + Math.abs(box.height * Math.cos(angle));
    let center = {
      x: box.x + box.width/2,
      y: box.y + box.height/2
    };
  
    let yDiff = Math.sin(angle-Math.PI/2) * length/2;
    let xDiff = Math.cos(angle-Math.PI/2) * length/2;
  
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

// 외적 구하기 
export function CCW(A, B, C) {
    // cross (B - A, C - A)

    if (isUndefined(C)) {
        return Vect3.cross2d(A, B);
    }

    return Vect3.cross2d(Vect3.sub(B, A), Vect3.sub(C, A))
}

// refer to http://www.secmem.org/blog/2019/01/11/Deluanay_Triangulation/
export function incircle (a, b, c, d) {
    var ccw = CCW(a, b, c)

    var adx = a.x - d.x;
    var ady = a.y - d.y;
    var bdx = b.x - d.x;
    var bdy = b.y - d.y;
    var cdx = c.x - d.x;
    var cdy = c.y - d.y;

    var bdxcdy = bdx * cdy, cdxbdy = cdx * bdy;
    var cdxady = cdx * ady, adxcdy = adx * cdy;
    var adxbdy = adx * bdy, bdxady = bdx * ady;

    var alift = adx * adx + ady * ady;
    var blift = bdx * bdx + bdy * bdy;
    var clift = cdx * cdx + cdy * cdy;
    
    var det = alift * (bdxcdy - cdxbdy) + blift * (cdxady - adxcdy) + clift * (adxbdy - bdxady);
    
    if(ccw > 0) return det >= 0;
    else return det <= 0;
}

export function initPolygon (polygon, x, y) {

    var A = Vect3.create(Math.min(x, y), Math.max(x, y))

    var selectedIndex = -1; 
    for(var i = 0, len = polygon.length; i < len; i++ ) {
        if (Vect3.equal(polygon[i], A)) {
            selectedIndex = i;
            break; 
        }
    }

    if (selectedIndex > -1) {
        polygon.splice(selectedIndex, 1);
    } else {
        polygon.push(A)
    }
}

function swap (data, i, j) {
    var temp = data[i];
    data[i] = data[j]
    data[j] = temp 
}

export function Deluanay (points = []) {    

    var n = points.length;

    points[n] = Vect3.create(-2e9, -2e9)
    points[n+1] = Vect3.create(2e9, -2e9)
    points[n+2] = Vect3.create(0, 2e9)

    var triangle = [Vect3.create(n, n+1, n+2)] 

    for(var i = 0; i < n; i++) {
        let polygon = [];

        var complete = new Array(triangle.length);

        for(var j = 0; j < triangle.length; j++) {
            if(complete[j]) continue;
            var current = triangle[j];

            if (!current) continue;

            var a = points[current.x]
            var b = points[current.y]
            var c = points[current.z]
            var d = points[i]

            if(incircle(a, b, c, d)) {

                initPolygon(polygon, current.x, current.y)
                initPolygon(polygon, current.y, current.z)
                initPolygon(polygon, current.z, current.x)


                swap(complete, j, triangle.length - 1 ); 
                swap(triangle, j, triangle.length - 1);
                triangle.pop();
                j--;
                continue;
            }
            complete[j] = true;
        }

        polygon.forEach(current => {

            var a = points[current.x]
            var b = points[current.y]
            var d = points[i]

            if (CCW(a, b, d) === 0) {  // 0 은 평면 

            } else {
                triangle.push(Vect3.create(current.x, current.y, i))
            }
        })
    }

    // SuperTriangle delete    
    for(var i = 0; i < triangle.length; i++) {
        var current = triangle[i]

        if (current.x >= n || current.y >= n || current.z >= n) {
            swap(triangle, i, triangle.length - 1);
            triangle.pop();
            i--;
            continue; 
        }
    }

    return triangle.map(current => {
        return {
            a: points[current.x], 
            b: points[current.y], 
            c: points[current.z] 
        }
    })
}

export function generate_sample_points(width, height, xSize =  50, ySize = 50, boxSize = 100, variance = 1, func = () => Math.random()) {
  var points = [];
  var minX = -xSize; 
  var maxX = width + xSize;
  var minY = -ySize; 
  var maxY = height + ySize; 
  for (var x = minX; x < maxX; x += boxSize) {
    for (var y = minY; y < maxY; y += boxSize) {
        var tempX = Math.floor(x + (boxSize / 2) * (func() * variance * 2  - variance));
        var tempY = Math.floor(y + (boxSize / 2) * (func() * variance * 2  - variance));
        points[points.length] = { x: tempX, y: tempY }
    }
  }

  return points;
}

export function getCenterInTriangle (a, b, c) {
    return {
        x: (a.x + b.x + c.x) / 3 ,
        y: (a.y + b.y + c.y) / 3
    }
}

const splitReg = /[\b\t \,\n]/g;
export function normalize (str) {
    return str.trim().split(splitReg).filter(it => it).map(it  => +it);
}