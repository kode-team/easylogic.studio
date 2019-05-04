import {
    filter
} from '../functions'

export default function sobel () {
    return filter('sobel-horizontal sobel-vertical');
}