import {
    pixel
} from '../functions'

export default function polaroid () {

    const $matrix = [
        1.438,-0.062,-0.062,0,
        -0.122,1.378,-0.122,0,
        -0.016,-0.016,1.483,0,
        0,0,0,1
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