import {
    parseParamNumber,
    pixel
} from '../functions'

export default function kodachrome () {

    const $matrix = [
        1.1285582396593525,-0.3967382283601348,-0.03992559172921793,0,
        -0.16404339962244616,1.0835251566291304,-0.05498805115633132,0,
        -0.16786010706155763,-0.5603416277695248,1.6014850761964943,0,
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