import {
    convolution
} from '../functions'

export default function identity () {
    return convolution([
        0, 0, 0,
        0, 1, 0,
        0, 0, 0
    ]);
}