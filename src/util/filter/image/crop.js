import { createBitmap } from '../functions'

export default function crop (startX = 0, startY = 0, width, height) {

    const newBitmap = createBitmap(width * height * 4, width, height)

    return function (bitmap, done, opt = {}) {
        for (var y = startY, realY = 0; y < height; y++, realY++) {
            for (var x = startX, realX = 0; x < width; x++, realX++) {
                newBitmap.pixels[realY * width * realX] = bitmap.pixels[y * width * x]
            }
        }

        done(newBitmap);
    }
}
