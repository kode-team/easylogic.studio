import {
    parseParamNumber,
    convolution
} from '../functions'
/*
 * carve, mold, or stamp a design on (a surface) so that it stands out in relief.
 * 
 * @param {Number} amount   0.0 .. 4.0 
 */
export default function emboss (amount = 4) {
    amount = parseParamNumber(amount)    
    return convolution([
        amount * (-2.0), -amount, 0.0,
        -amount, 1.0, amount,
        0.0, amount, amount * 2.0,
    ]);
}
