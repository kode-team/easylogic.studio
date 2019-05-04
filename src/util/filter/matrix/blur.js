import {
    convolution,
    parseParamNumber,
    createBlurMatrix
} from '../functions'

export default function (amount = 3, hasAlphaChannel = true) {

    amount = parseParamNumber(amount)

    return convolution(createBlurMatrix(amount))
}