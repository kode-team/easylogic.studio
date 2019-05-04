import {
    pixel
} from '../functions'

export default function brownie () {

    const $matrix = [
        0.5997023498159715,0.34553243048391263,-0.2708298674538042,0,
        -0.037703249837783157,0.8609577587992641,0.15059552388459913,0,
        0.24113635128153335,-0.07441037908422492,0.44972182064877153,0,
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