import {
    parseParamNumber,
    pixel
} from '../functions'

/**
 * 
 * @param {Number} amount 1..100
 */
export default function noise (amount = 1) {
    const $C = parseParamNumber(amount)    
    return pixel(() => {
        const C = Math.abs($C) * 5
        const min = -C
        const max = C 
        const noiseValue = Math.round(min + (Math.random() * (max - min)))

        $r += noiseValue
        $g += noiseValue
        $b += noiseValue
    }, {
        $C
    })
}