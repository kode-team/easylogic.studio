import {
    parseParamNumber,
    pixel
} from '../functions'
/**
 * change the relative darkness of (a part of an image) by overexposure to light.
 * @param {*} r 
 * @param {*} g 
 * @param {*} b 
 */
export default function solarize (redValue, greenValue, blueValue) {
    const $redValue = parseParamNumber(redValue)    
    const $greenValue = parseParamNumber(greenValue)    
    const $blueValue = parseParamNumber(blueValue)    
    return pixel(() => {
        $r = ($r < $redValue) ? 255 - $r: $r
        $g = ($g < $greenValue) ? 255 - $g: $g
        $b = ($b < $blueValue) ? 255 - $b: $b
    }, {
        $redValue, $greenValue, $blueValue
    })

}
