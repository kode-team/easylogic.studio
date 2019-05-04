import {
    parseParamNumber,
    convolution
} from '../functions'

export default function kirschVertical (count = 1) {
    count = parseParamNumber(count)    
    return convolution([
        5, -3, -3,
        5, 0, -3,
        5, -3, -3
    ]);
}