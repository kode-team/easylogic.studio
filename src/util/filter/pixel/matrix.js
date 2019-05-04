import {
    parseParamNumber,
    pixel
} from '../functions'

export default function matrix (
    $a = 0, $b = 0, $c = 0, $d = 0, 
    $e = 0, $f = 0, $g = 0, $h = 0, 
    $i = 0, $j = 0, $k = 0, $l = 0, 
    $m = 0, $n = 0, $o = 0, $p = 0
) {

    const $matrix = [
        $a, $b, $c, $d, 
        $e, $f, $g, $h, 
        $i, $j, $k, $l, 
        $m, $n, $o, $p
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