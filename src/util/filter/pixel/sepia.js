import {
    parseParamNumber,
    pixel
} from '../functions'

/*
 * @param {Number} amount  0..1 
 */
export default function sepia (amount = 1) {
    let C = parseParamNumber(amount);
    if (C > 1) C = 1; 

    const $matrix = [
        (0.393 + 0.607 * (1 - C)), (0.769 - 0.769 * (1 - C)), (0.189 - 0.189 * (1 - C)), 0,
        (0.349 - 0.349 * (1 - C)), (0.686 + 0.314 * (1 - C)), (0.168 - 0.168 * (1 - C)), 0,
        (0.272 - 0.272 * (1 - C)), (0.534 - 0.534 * (1 - C)), (0.131 + 0.869 * (1 - C)), 0,
        0, 0, 0, 1
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