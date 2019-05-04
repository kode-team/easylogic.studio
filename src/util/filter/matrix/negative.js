import {
    parseParamNumber,
    convolution,
    weight
} from '../functions'

export default function negative (amount = 100) {
    amount = parseParamNumber(amount)    
    return convolution(weight([
        -1, 0, 0, 0, 0,
        0, -1, 0, 0, 0,
        0, 0, -1, 0, 0,
        0, 0, 0, 1, 0,
        1, 1, 1, 1, 1
    ], amount / 100));
}
