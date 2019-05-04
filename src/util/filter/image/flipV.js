import {
    swapColor
} from '../functions'  
export default function flipV () {
    return function (bitmap, done, opt = {}) {

        const width = bitmap.width
        const height = bitmap.height 
        const isCenter = height % 2 == 1 ? 1 : 0 

        const halfHeight = isCenter ? Math.floor(height / 2) : height / 2 ;

        for (var y = 0; y < halfHeight; y++) {
            for (var x = 0; x < width; x++) {

                var startIndex = (y * width + x) << 2 
                var endIndex = ((height -1 - y) * width + x ) << 2
                swapColor(bitmap.pixels, startIndex, endIndex)

            }
        }

        done(bitmap);
    }
}