import {
    parseParamNumber,
    pixel
} from '../functions'
/**
 * 
 * @param {*} amount   min = -128, max = 128 
 */
export default function contrast(amount = 0) {
    amount = parseParamNumber(amount)       
    const $C = Math.max((128 + amount) / 128, 0);

    return pixel(() => {
        $r *= $C
        $g *= $C
        $b *= $C
    }, { $C })
}