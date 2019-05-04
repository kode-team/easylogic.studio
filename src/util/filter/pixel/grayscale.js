import {
    parseParamNumber,
    pixel
} from '../functions'

export default function grayscale (amount = 100) { 
    amount = parseParamNumber(amount)          
    let C = amount / 100;

    if (C > 1) C = 1; 

    const $matrix = [
        (0.2126 + 0.7874 * (1 - C)), (0.7152 - 0.7152 * (1 - C)), (0.0722 - 0.0722 * (1 - C)), 0,
        (0.2126 - 0.2126 * (1 - C)), (0.7152 + 0.2848 * (1 - C)), (0.0722 - 0.0722 * (1 - C)), 0,
        (0.2126 - 0.2126 * (1 - C)), (0.7152 - 0.7152 * (1 - C)), (0.0722 + 0.9278 * (1 - C)), 0,
        0, 0, 0, 1
    ]
    
    return pixel(() => {
        $r = $matrix[0] * $r + $matrix[1] * $g + $matrix[2] * $b + $matrix[3] * $a
        $g = $matrix[4] * $r + $matrix[5] * $g + $matrix[6] * $b + $matrix[7] * $a
        $b = $matrix[8] * $r + $matrix[9] * $g + $matrix[10] * $b + $matrix[11] * $a
        $a = $matrix[12] * $r + $matrix[13] * $g + $matrix[14] * $b + $matrix[15] * $a
    }, {
        $matrix 
    });
} 