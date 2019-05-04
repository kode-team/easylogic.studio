import {
    parseParamNumber,
    pixel
} from '../functions'

export default function shade(redValue = 1, greenValue = 1, blueValue = 1) {
    const $redValue = parseParamNumber(redValue)        
    const $greenValue = parseParamNumber(greenValue)        
    const $blueValue = parseParamNumber(blueValue)      

    return pixel(() => {
        $r *= $redValue
        $g *= $greenValue
        $b *= $blueValue
    }, {
        $redValue,
        $greenValue,
        $blueValue
    })

}