import {
    parseParamNumber,
    convolution
} from '../functions'

export default function kirschHorizontal (count = 1) {
    count = parseParamNumber(count)    
    return convolution([
        5, 5, 5,
        -3, 0, -3,
        -3, -3, -3
    ]);
}