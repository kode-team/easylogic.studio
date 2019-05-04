import {
    parseParamNumber,
    convolution,
    weight
} from '../functions'

export default function unsharpMasking (amount = 256) {
    amount = parseParamNumber(amount)
    return convolution(weight([
        1, 4, 6, 4, 1,
        4, 16, 24, 16, 4,
        6, 24, -476, 24, 6,
        4, 16, 24, 16, 4,
        1, 4, 6, 4, 1
    ], -1 / amount));
}