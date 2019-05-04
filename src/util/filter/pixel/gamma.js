import {
    parseParamNumber,
    pixel
} from '../functions'

export default function gamma (amount = 1) {
    const $C = parseParamNumber(amount)    
    return pixel(() => {
        $r = Math.pow($r / 255, $C) * 255
        $g = Math.pow($g / 255, $C) * 255
        $b = Math.pow($b / 255, $C) * 255
    }, { $C })
}