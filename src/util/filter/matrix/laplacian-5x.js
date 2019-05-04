import {
    parseParamNumber,
    convolution,
    weight
} from '../functions'

export default function laplacian5x (amount = 100) {
    amount = parseParamNumber(amount)
    return convolution(weight([
        -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1,
        -1, -1, 24, -1, -1,
        -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1
    ], amount / 100));
}
