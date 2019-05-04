import {
    parseParamNumber,
    pixel
} from '../functions'

/*
 * @param {Number} amount  -100..100  ,  value < 0  is darken, value > 0 is brighten 
 */
export default function brightness (amount = 1) {
    amount = parseParamNumber(amount)    
    const $C = Math.floor(255 * (amount / 100));

    return pixel(() => {
        $r += $C 
        $g += $C 
        $b += $C 
    },{ $C })
}