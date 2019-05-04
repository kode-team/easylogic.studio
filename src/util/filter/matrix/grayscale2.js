import {
    parseParamNumber,
    convolution,
    weight
} from '../functions'

export default function grayscale2 (amount = 100) {
    amount = parseParamNumber(amount)    
    return convolution(weight([
        0.3, 0.3, 0.3, 0, 0,
        0.59, 0.59, 0.59, 0, 0,
        0.11, 0.11, 0.11, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0
    ], amount / 100));
}