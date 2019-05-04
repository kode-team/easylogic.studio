import {
    pixel
} from '../functions'

export default function technicolor () {

    const $matrix = [
        1.9125277891456083,-0.8545344976951645,-0.09155508482755585,0,
        -0.3087833385928097,1.7658908555458428,-0.10601743074722245,0,
        -0.231103377548616,-0.7501899197440212,1.847597816108189,0,
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