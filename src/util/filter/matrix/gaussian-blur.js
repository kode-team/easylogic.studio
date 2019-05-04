import {
    parseParamNumber,
    convolution,
    weight
} from '../functions'

export default function gaussianBlur (amount = 100) {
    amount = parseParamNumber(amount)    
    const C = amount / 100; 

    return convolution(weight([
        1, 2, 1,
        2, 4, 2,
        1, 2, 1
    ], (1/16) * C ));
}