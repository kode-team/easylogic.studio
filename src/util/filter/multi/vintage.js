import {
    filter
} from '../functions'

export default function vintage () {
    return filter(`brightness(15) saturation(-20) gamma(1.8)`)
}