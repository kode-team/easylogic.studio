import {
    convolution,
    weight
} from '../functions'


export default function motionBlur3 () {
    return convolution(weight([
        1, 0, 0, 0, 1, 0, 0, 0, 1,
        0, 1, 0, 0, 1, 0, 0, 1, 0,
        0, 0, 1, 0, 1, 0, 1, 0, 0,
        0, 0, 0, 1, 1, 1, 0, 0, 0,
        1, 1, 1, 1, 1, 1, 1, 1, 1,
        0, 0, 0, 1, 1, 1, 0, 0, 0,
        0, 0, 1, 0, 1, 0, 1, 0, 0,
        0, 1, 0, 0, 1, 0, 0, 1, 0,
        1, 0, 0, 0, 1, 0, 0, 0, 1,
    ], 1 / 9));
}