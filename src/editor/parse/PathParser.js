
import { isNotUndefined } from "../../util/functions/func";

const parseRegForPath = /([mMlLvVhHcCsSqQtTaAzZ]([^mMlLvVhHcCsSqQtTaAzZ]*))/g;
const splitReg = /[\b\t \,]/g;

const matrix = {

    multiply : function (a) {
        return function (b, startIndex) {
            var x = +b[startIndex];
            var y = +b[startIndex+1];

            return [
                a[0][0] * x + a[0][1] * x +  a[0][2] * x,
                a[1][0] * y + a[1][1] * y +  a[1][2] * y,
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
            [Math.cos(angle) , Math.sin(angle), 0]
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
            [1, x, 0],
            [0, 1, 0],
            [0, 0, 1]
        ]);
    },

    skewY : function (y) {
        return this.multiply([
            [1, 0, 0],
            [y, 1, 0],
            [0, 0, 1]
        ]);
    },

    reflectionOrigin : function () {
        return this.multiply([
            [-1, 0, 0],
            [0, -1, 0],
            [0, 0, 1]
        ]);
    },

    reflectionX : function () {
        return this.multiply([
            [1, 0, 0],
            [0, -1, 0],
            [0, 0, 1]
        ]);
    },

    reflectionY : function () {
        return this.multiply([
            [-1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ]);
    }
};

export default class PathParser {

    constructor (pathString) {
		this.segments =  [];
        this.pathString = pathString; 
        
        this.parse()
    }
	
    trim (str)  {
        return str.split(splitReg).filter(it => it != '');
    }

    parse () {
        var arr = this.pathString.match(parseRegForPath);
        this.segments = arr.map(s => {
            var command = s[0]
            var values = this.trim(s.replace(command, ''));
            
            return { command, values }
        });
    }

    length () {
        return this.segments.length;
    }

	setSegments (index, seg) {
        this.segments[index] = seg;
    }

	getSegments (index) {
        if (isNotUndefined(index)) {
            return this.segments[index];
        }
        return this.segments;
    }

	joinPath () {

        return this.segments.map(it => {
            return (it.command === 'Z' || it.command === 'z') ? it.command : `${it.command} ${it.values.join(' ')}`
        }).join('')
    }

    each (callback) {

        this.segments = this.segments.map(segment => {
            return callback.call(this, segment);
        })
    }

    _loop (m) {
        this.each(function(segment) {
            var v = segment.values;
            var c = segment.command.toUpperCase();

            switch(c) {
            case 'M':
            case 'L':
                segment.values = m(v, 0);
                break; 
            case 'V':
                var result = m([+v[0], 0]);
                segment.values = [result[0]];                
                break;
            case 'H':
                var result = m([0, +v[0]]);
                segment.values = [result[1]];                
                break; 
            case 'C':
            case 'S':
            case 'T':
            case 'Q':
                for(var i = 0, len = v.length; i < len; i+=2) {
                    var result = m(v, i);
                    segment.values[i] = result[0];
                    segment.values[i+1] = result[1];
                }
                break; 
            case 'A':

                break; 
            }

        });
    }

    translate (tx, ty) {
        this._loop(matrix.translate(tx, ty));
    }

    scale (sx, sy) {
        this._loop(matrix.scale(sx, sy));
    }

    rotate (angle) {
        this._loop(matrix.rotate(angle));
    }

    reflectionOrigin (angle) {
        this._loop(matrix.reflectionOrigin(angle));
    }

    reflectionX (angle) {
        this._loop(matrix.reflectionX(angle));
    }

    reflectionY = function (angle) {
        this._loop(matrix.reflectionY(angle));
    }

    skewX (sx) {
        this._loop(matrix.skewX(sx));
    }

    skewY (sy) {
        this._loop(matrix.skewY(sy));
    }
}