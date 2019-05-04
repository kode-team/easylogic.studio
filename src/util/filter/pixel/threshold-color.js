import {
    parseParamNumber,
    pixel
} from '../functions'


export default function thresholdColor (scale = 200, amount = 100, hasColor = true) {
    const $scale = parseParamNumber(scale)    
    amount = parseParamNumber(amount)    
    const $C = amount / 100;
    const $hasColor = hasColor

    return pixel(() => {
        // refer to Color.brightness 
        const v = ($C * Math.ceil($r * 0.2126 + $g * 0.7152 + $b * 0.0722) ) >= $scale ? 255 : 0;

        if ($hasColor) {

            if (v == 0) {
                $r = 0 
                $g = 0 
                $b = 0
            }
            
        } else {
            const value = Math.round(v)
            $r = value 
            $g = value 
            $b = value 
        }
        
    }, {
        $C, $scale, $hasColor
    })
}
