import {
    parseParamNumber,
    convolution,
    weight
} from '../functions'

export default function transparency (amount = 100) {
    amount = parseParamNumber(amount)
    return convolution(weight([
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 0.3, 0,
        0, 0, 0, 0, 1,
    ], amount / 100));
}