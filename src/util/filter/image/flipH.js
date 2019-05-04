import {swapColor} from '../functions'
export default function flipH () {
    return function (bitmap, done, opt = {}) {

        const width = bitmap.width
        const height = bitmap.height 
        const isCenter = width % 2 == 1 ? 1 : 0 

        const halfWidth = isCenter ? Math.floor(width / 2) : width / 2 ;

        for (var y = 0; y < height; y++) {
            for (var x = 0; x < halfWidth; x++) {

                var startIndex = (y * width + x) << 2 
                var endIndex = (y * width +  (width -1 - x) ) << 2
                swapColor(bitmap.pixels, startIndex, endIndex)

            }
        }

        done(bitmap);
    }
}
