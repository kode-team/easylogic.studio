import {
    parseParamNumber,
    convolution,
    weight
} from '../functions'

export default function sepia2 (amount = 100) {
    amount = parseParamNumber(amount)    
    return convolution(weight([
        0.393, 0.349, 0.272, 0, 0,
        0.769, 0.686, 0.534, 0, 0,
        0.189, 0.168, 0.131, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0
    ], amount / 100));
}