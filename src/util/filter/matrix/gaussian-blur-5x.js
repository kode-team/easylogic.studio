import {
    parseParamNumber,
    convolution,
    weight
} from '../functions'

export default function gaussianBlur5x (amount = 100) {
    amount = parseParamNumber(amount)    
    const C = amount / 100;
    return convolution(weight([
        1, 4, 6, 4, 1,
        4, 16, 24, 16, 4,
        6, 24, 36, 24, 6,
        4, 16, 24, 16, 4,
        1, 4, 6, 4, 1
    ], (1/256) * C ));
}