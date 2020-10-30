import { Length } from "@unit/Length";

/**
 * @deprecated
 * @class
 */
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

export default {
    /**
     * @property
     * @deprecated
     */
    matrix2d,
    Vect3,
}