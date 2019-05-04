import {
    parseParamNumber
} from '../functions'

import StackBlur from '../StackBlur'

export default function (radius = 10, hasAlphaChannel = true) {
    radius = parseParamNumber(radius)

    return function (bitmap, done, opt = {}) {
        let newBitmap = StackBlur(bitmap, radius, hasAlphaChannel )

        done(newBitmap);
    }
}