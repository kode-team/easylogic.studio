import thresholdColor from './threshold-color'
/*
 * @param {Number} amount  0..100 
 */
export default function threshold (scale = 200, amount = 100) {
    return thresholdColor(scale, amount, false)
}
