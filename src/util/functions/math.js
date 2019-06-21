import { isUndefined } from "./func";

export function round (n, k) {
    k = isUndefined(k) ? 1 : k; 
    return Math.round(n * k) / k;
}


export function degreeToRadian (degrees) {
    return degrees * Math.PI / 180;
}

/**
 * 
 * convert radian to degree 
 * 
 * @param {*} radian 
 * @returns {Number} 0..360
 */
export function radianToDegree(radian) {
    var angle =  radian * 180 / Math.PI;


    if (angle < 0) {   // 각도가 0보다 작으면 360 에서 반전시킨다. 
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
    return Math.sqrt( 
        Math.pow(Math.abs(centerX - x), 2) 
        + 
        Math.pow(Math.abs(centerY - y), 2) 
    )
}

export function calculateAngle (rx, ry) {
    return radianToDegree(Math.atan2(ry, rx))
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