import {
    parseParamNumber,
    pixel
} from '../functions'
export default function invert (amount = 100) {
    amount = parseParamNumber(amount)    
    const $C = amount / 100; 

    return pixel(() => {
        $r = (255 - $r) * $C
        $g = (255 - $g) * $C
        $b = (255 - $b) * $C
    }, {
        $C
    })
}
