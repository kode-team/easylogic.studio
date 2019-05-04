import {
    parseParamNumber,
    pixel
} from '../functions'

/**
 * 
 * @param {Number} amount from 0 to 100 
 */
export default function clip (amount = 0) {
    amount = parseParamNumber(amount)    
    const $C = Math.abs(amount) * 2.55

    return pixel(() => {

        $r = ($r > 255 - $C) ? 255 : 0
        $g = ($g > 255 - $C) ? 255 : 0
        $b = ($b > 255 - $C) ? 255 : 0

    }, { $C })
}