import {
    parseParamNumber,
    pixel
} from '../functions'

/*
 * @param {Number} amount   0..360  
 */
export default function hue (amount = 360) {
    const $C = parseParamNumber(amount)          
    return pixel(() => {
        var hsv = Color.RGBtoHSV($r, $g, $b);

        // 0 ~ 360 
        var h = hsv.h;
        h += Math.abs($amount)
        h = h % 360
        hsv.h = h

        var rgb = Color.HSVtoRGB(hsv);

        $r = rgb.r
        $g = rgb.g
        $b = rgb.b
    }, {
        $C
    })
}
