import {
    parseParamNumber,
    packXY,
    createBitmap,
    fillPixelColor
} from '../functions'

import rotateDegree from './rotateDegree'

export default function rotate (degree = 0) {
    degree = parseParamNumber(degree)     
    degree = degree % 360
    return function (bitmap, done, opt = {}) {

        if (degree == 0) return bitmap

        if (degree == 90 || degree == 270) {
            var newBitmap = createBitmap(bitmap.pixels.length, bitmap.height, bitmap.width)
        } else if (degree == 180) {
            var newBitmap = createBitmap(bitmap.pixels.length, bitmap.width, bitmap.height)
        } else {
            return rotateDegree(degree)(bitmap, done, opt)
        }
        packXY((pixels, i, x, y) => {

            if (degree == 90) {
                var endIndex = (x * newBitmap.width + (newBitmap.width -1 - y) ) << 2  //  << 2 is equals to (multiply)* 4 
            } else if (degree == 270) {
                var endIndex = ( (newBitmap.height -1 -x) * newBitmap.width + y ) << 2
            } else if (degree == 180) {
                var endIndex = ((newBitmap.height -1 -y) * newBitmap.width + (newBitmap.width -1 -x)) << 2
            }

            fillPixelColor(newBitmap.pixels, endIndex, bitmap.pixels, i)
        })(bitmap, function () {
            done(newBitmap)
        }, opt)
    }
}