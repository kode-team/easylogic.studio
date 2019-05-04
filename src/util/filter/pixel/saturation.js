import {
    parseParamNumber,
    pixel
} from '../functions'

/*
 * @param {Number} amount  -100..100 
 */
export default function saturation (amount = 100) {
    amount = parseParamNumber(amount)    
    const C = amount / 100 
    const L = 1 - Math.abs(C);

    const $matrix = [
        L, 0, 0, 0,
        0, L, 0, 0,
        0, 0, L, 0,
        0, 0, 0, L
    ]

    return pixel(() => {
        $r = $matrix[0] * $r + $matrix[1] * $g + $matrix[2] * $b + $matrix[3] * $a
        $g = $matrix[4] * $r + $matrix[5] * $g + $matrix[6] * $b + $matrix[7] * $a
        $b = $matrix[8] * $r + $matrix[9] * $g + $matrix[10] * $b + $matrix[11] * $a
        $a = $matrix[12] * $r + $matrix[13] * $g + $matrix[14] * $b + $matrix[15] * $a        
    }, {
        $matrix 
    })

}