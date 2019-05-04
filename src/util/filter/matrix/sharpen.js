import {
    parseParamNumber,
    convolution,
    weight
} from '../functions'

export default function sharpen (amount = 100) {
    amount = parseParamNumber(amount)    
    return convolution(weight([
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
    ], amount / 100));
}