import Matrix from '../../Matrix'
import {
    createBitmap,
    packXY,
    fillPixelColor
} from '../functions'
import { POSITION_CENTER } from '../../css/types';

export default function rotateDegree(angle, cx = POSITION_CENTER, cy = POSITION_CENTER) {
    // const r = F.radian(angle)

    return function (bitmap, done, opt = {}) {
        var newBitmap = createBitmap(bitmap.pixels.length, bitmap.width, bitmap.height)
        const width = bitmap.width 
        const height = bitmap.height 

        if (cx == POSITION_CENTER) {
            cx = Math.floor(width / 2); 
        }

        if (cy == POSITION_CENTER) {
            cy = Math.floor(height/ 2);
        }

        const translateMatrix = Matrix.CONSTANT.translate(-cx, -cy)
        const translateMatrix2 = Matrix.CONSTANT.translate(cx, cy)
        const shear1Matrix = Matrix.CONSTANT.shear1(angle)
        const shear2Matrix = Matrix.CONSTANT.shear2(angle)

        packXY((pixels, i, x, y) => {
            // console.log(x, y, i)
            let arr = Matrix.multiply(translateMatrix, [x, y, 1])
            
            arr = Matrix.multiply(shear1Matrix, arr).map(Math.round)
            arr = Matrix.multiply(shear2Matrix, arr).map(Math.round)
            arr = Matrix.multiply(shear1Matrix, arr).map(Math.round)
            arr = Matrix.multiply(translateMatrix2, arr)
 
            const [x1, y1] = arr

            if (x1 < 0) return;   
            if (y1 < 0) return; 
            if (x1 > width-1) return;
            if (y1 > height-1) return; 

            var endIndex = (y1 * width + x1) << 2   //  bit 2 shift is  * 4  

            fillPixelColor(pixels, endIndex, bitmap.pixels, i)

        })(newBitmap, function () {
            done(newBitmap)
        }, opt)
    }
} 