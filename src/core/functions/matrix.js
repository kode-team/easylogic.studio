import { Length } from "@unit/Length";

const matrix2d = {

    multiply : function (a) {
        return function (b, startIndex) {
            var x = +b[startIndex];
            var y = +b[startIndex+1];

            return [
                a[0][0] * x + a[0][1] * y +  a[0][2],
                a[1][0] * x + a[1][1] * y +  a[1][2],
                1
            ];            
        };
    },

    translate : function (tx, ty) {
        return this.multiply([
            [1, 0, tx],
            [0, 1, ty],
            [0, 0, 1]
        ]);
    },

    rotate : function (angle) {
        return this.multiply([
            [Math.cos(angle) , Math.sin(angle), 0],
            [-Math.sin(angle),  Math.cos(angle), 0],
            [0, 0, 1]
        ]);
    },

    scale : function (sx, sy) {
        return this.multiply([
            [sx, 0, 0],
            [0, sy, 0],
            [0, 0, 1]
        ]);
    },

    skewX : function (x) {
        return this.multiply([
            [1, Math.tan(x), 0],
            [0, 1, 0],
            [0, 0, 1]
        ]);

        // a + Math.tan(x) * (disty) 
    },

    skewY : function (y) {
        return this.multiply([
            [1, 0, 0],
            [Math.tan(y), 1, 0],
            [0, 0, 1]
        ]);
    },

    flip : function () {
        return this.multiply([
            [-1, 0, 0],
            [0, -1, 0],
            [0, 0, 1]
        ]);
    },

    flipX : function () {
        return this.multiply([
            [-1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ]);
    },

    flipY : function () {
        return this.multiply([
            [1, 0, 0],
            [0, -1, 0],
            [0, 0, 1]
        ]);
    }
};

export const Vect3 = {
    create: function(x, y, z) {
        return {x: x || 0, y: y || 0, z: z || 0};
    },
    add: function(v1, v2) {
        return {x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z};
    },
    sub: function(v1, v2) {
        return {x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z};
    },
    mul: function(v1, v2) {
        return {x: v1.x * v2.x, y: v1.y * v2.y, z: v1.z * v2.z};
    },
    div: function(v1, v2) {
        return {x: v1.x / v2.x, y: v1.y / v2.y, z: v1.z / v2.z};
    },
    muls: function(v, s) {
        return {x: v.x * s, y: v.y * s, z: v.z * s};
    },
    divs: function(v, s) {
        return {x: v.x / s, y: v.y / s, z: v.z / s};
    },
    len: function(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    },
    dot: function(v1, v2) {
        return (v1.x * v2.x) + (v1.y * v2.y) + (v1.z * v2.z);
    },
    cross2d: function (v1, v2) {
        return v1.x * v2.y - v1.y * v2.x; 
    },
    cross: function(v1, v2) {
        return {x: v1.y * v2.z - v1.z * v2.y, y: v1.z * v2.x - v1.x * v2.z, z: v1.x * v2.y - v1.y * v2.x};
    },
    normalize: function(v) {
        return Vect3.divs(v, Vect3.len(v));
    },
    ang: function(v1, v2) {
        return Math.acos(Vect3.dot(v1, v2) / (Vect3.len(v1) * Vect3.len(v2)));
    },
    copy: function(v) {
        return {x: v.x, y: v.y, z: v.z};
    },
    equal: function(v1,v2) {
        return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
    },
    rotate: function(v1, v2) {
        var x1 = v1.x,
            y1 = v1.y,
            z1 = v1.z,
            angleX = v2.x / 2,
            angleY = v2.y / 2,
            angleZ = v2.z / 2,

            cr = Math.cos(angleX),
            cp = Math.cos(angleY),
            cy = Math.cos(angleZ),
            sr = Math.sin(angleX),
            sp = Math.sin(angleY),
            sy = Math.sin(angleZ),

            w = cr * cp * cy + -sr * sp * sy,
            x = sr * cp * cy - -cr * sp * sy,
            y = cr * sp * cy + sr * cp * -sy,
            z = cr * cp * sy - -sr * sp * cy,

            m0 = 1 - 2 * ( y * y + z * z ),
            m1 = 2 * (x * y + z * w),
            m2 = 2 * (x * z - y * w),

            m4 = 2 * ( x * y - z * w ),
            m5 = 1 - 2 * ( x * x + z * z ),
            m6 = 2 * (z * y + x * w ),

            m8 = 2 * ( x * z + y * w ),
            m9 = 2 * ( y * z - x * w ),
            m10 = 1 - 2 * ( x * x + y * y );

        return {
            x: x1 * m0 + y1 * m4 + z1 * m8,
            y: x1 * m1 + y1 * m5 + z1 * m9,
            z: x1 * m2 + y1 * m6 + z1 * m10
        };
    }
};

// point • matrix
function multiplyMatrixAndPoint(matrix, point) {
    // Give a simple variable name to each part of the matrix, a column and row number
    let c0r0 = matrix.m11, c1r0 = matrix.m21, c2r0 = matrix.m31, c3r0 = matrix.m41;
    let c0r1 = matrix.m12, c1r1 = matrix.m22, c2r1 = matrix.m32, c3r1 = matrix.m42;
    let c0r2 = matrix.m13, c1r2 = matrix.m23, c2r2 = matrix.m33, c3r2 = matrix.m43;
    let c0r3 = matrix.m14, c1r3 = matrix.m24, c2r3 = matrix.m34, c3r3 = matrix.m44;
    
    // Now set some simple names for the point
    let x = point[0];
    let y = point[1];
    let z = point[2];
    let w = point[3];
    
    // Multiply the point against each part of the 1st column, then add together
    let resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);
    
    // Multiply the point against each part of the 2nd column, then add together
    let resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);
    
    // Multiply the point against each part of the 3rd column, then add together
    let resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);
    
    // Multiply the point against each part of the 4th column, then add together
    let resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);
    
    return [resultX, resultY, resultZ, resultW];
  }

//matrixB, matrixA
function multiplyMatrices(matrixA, matrixB) {
    // Slice the second matrix up into rows
    let row0 = [matrixB.m11, matrixB.m21, matrixB.m31, matrixB.m41];
    let row1 = [matrixB.m12, matrixB.m22, matrixB.m32, matrixB.m42];
    let row2 = [matrixB.m13, matrixB.m23, matrixB.m33, matrixB.m43];
    let row3 = [matrixB.m14, matrixB.m24, matrixB.m34, matrixB.m44];
  
    // Multiply each row by matrixA
    let result0 = multiplyMatrixAndPoint(matrixA, row0);
    let result1 = multiplyMatrixAndPoint(matrixA, row1);
    let result2 = multiplyMatrixAndPoint(matrixA, row2);
    let result3 = multiplyMatrixAndPoint(matrixA, row3);
  
    // Turn the result rows back into a single matrix
    return {
      m11: result0[0], m21: result0[1], m31: result0[2], m41: result0[3],
      m12: result1[0], m22: result1[1], m32: result1[2], m42: result1[3],
      m13: result2[0], m23: result2[1], m33: result2[2], m43: result2[3],
      m14: result3[0], m24: result3[1], m34: result3[2], m44: result3[3]
    }
}

function identity() {
    return {
        m11: 1, m21: 0, m31: 0, m41: 0,
        m12: 0, m22: 1, m32: 0, m42: 0,
        m13: 0, m23: 0, m33: 1, m43: 0,
        m14: 0, m24: 0, m34: 0, m44: 1
      }
  }
  

function multiplyMatricesArray(args) { 

    if (args.length === 0) return identity()


    let P = args[0];

    for(var i = 1, len = args.length; i< len; i++) {
        P = multiplyMatrices(P, args[i])  
    }

    return P; 
}
 
const addVector = (a, b) => {
    return Vect3.add(a, b);
}

const rotateVector = (a, b) => {
    return Vect3.rotate(a, b);
}


const convertMatrixXZY = ([x, y, z]) => {
    return { x, y, z}
}

export function computeVertextData(elem, topElement) {
    const transform = getCSSTransform(elem);
    const w = transform.origin[0].toPx(elem.offsetWidth).value;
    const h = transform.origin[1].toPx(elem.offsetHeight).value; 

    let v = {
        a : { x: -w,    y: -h, z: 0},  // top left 
        b : { x: w,     y: -h, z: 0},   // top right 
        c : { x: w,     y: h , z: 0},  // bottom right 
        d : { x: -w,    y: h , z: 0},   // bottom left 
    }

    const path = [] 
    const calculate = {x: 0, y: 0}
    while (elem.nodeType === 1) {
        const t = getCSSTransform(elem)
        path.unshift({ elem, matrix: t.matrix })

        calculate.x += t.position.x
        calculate.y += t.position.y

        elem = elem.parentNode; 

        if (elem === topElement) {
            break; 
        }
    }

    console.log(transform);

    const A = multiplyMatricesArray(path.map(p => p.matrix))

    console.log(A);

    v.a = convertMatrixXZY(multiplyMatrixAndPoint(A, [v.a.x, v.a.y, 0, 1]))
    v.b = convertMatrixXZY(multiplyMatrixAndPoint(A, [v.b.x, v.b.y, 0, 1]))
    v.c = convertMatrixXZY(multiplyMatrixAndPoint(A, [v.c.x, v.c.y, 0, 1]))
    v.d = convertMatrixXZY(multiplyMatrixAndPoint(A, [v.d.x, v.d.y, 0, 1]))

    v.a = addVector(v.a, {x: calculate.x + w, y: calculate.y + h, z: 0 })
    v.b = addVector(v.b, {x: calculate.x + w, y: calculate.y + h, z: 0 })
    v.c = addVector(v.c, {x: calculate.x + w, y: calculate.y + h, z: 0 })
    v.d = addVector(v.d, {x: calculate.x + w, y: calculate.y + h, z: 0 })


    v.center = {
        x: (v.a.x + v.c.x)/2, 
        y: (v.a.y + v.c.y)/2, 
        z: 0
    }

    console.log(JSON.stringify(v));

    return v; 
}

export function getCSSTransform (elem) {
    const style = getComputedStyle(elem, null);
    const x = Length.parse(style.left).value; 
    const y = Length.parse(style.top).value; 
    const [originX, originY, originZ] = style['transform-origin'].split(' ').map(it => Length.parse(it));

    var matrix = parseCSSMatrix (style.transform);

    var rotateY = Math.asin(-matrix.m13);
    var rotateX, rotateZ; 

    if (Math.cos(rotateY) !== 0) {
        rotateX = Math.atan2(matrix.m23, matrix.m33);
        rotateZ = Math.atan2(matrix.m12, matrix.m11);
    } else {
        rotateX = Math.atan2(-matrix.m31, matrix.m22);
        rotateZ = 0; 
    }

    return {
        matrix,
        origin: [originX, originY, originZ],
        position: {x, y, z: 0},
        rotate: { x: rotateX, y: rotateY, z: rotateZ },
        translate: { x: matrix.m41, y: matrix.m42, z: matrix.m43 }
    }
}

export function parseCSSMatrix (transformString) {
    var c = transformString.split(/\s*[(),]\s*/).slice(1, -1);

    if (c.length === 6) {   // matrix ()
        return {
            m11: +c[0], m21: +c[2], m31: 0, m41: +c[4],
            m12: +c[1], m22: +c[3], m32: 0, m42: +c[5],
            m13: 0,     m23: 0,     m33: 1, m43: 0,
            m14: 0,     m24: 0,     m34: 0, m44: 1
        } 
    } else if (c.length === 16) {   // matrix3d()
        return {
            m11: +c[0], m21: +c[4], m31: +c[8], m41: +c[12],
            m12: +c[1], m22: +c[5], m32: +c[9], m42: +c[13],
            m13: +c[2], m23: +c[6], m33: +c[10], m43: +c[14],
            m14: +c[3], m24: +c[7], m34: +c[11], m44: +c[15],
        }
    }

    // invalid values 
    return {
        m11: 1,     m21: 0,     m31: 0,     m41: 0,
        m12: 0,     m22: 1,     m32: 0,     m42: 0,
        m13: 0,     m23: 0,     m33: 1,     m43: 0,
        m14: 0,     m24: 0,     m34: 0,     m44: 1,
    }
}

export default {
    matrix2d,
    Vect3,
    addVector,
    rotateVector
}