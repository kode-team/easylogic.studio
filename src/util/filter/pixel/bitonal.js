import Color from '../../Color'
import { pixel  } from '../functions'


export default function bitonal(darkColor, lightColor, threshold = 100) {
    let $darkColor = Color.parse(darkColor);
    let $lightColor = Color.parse(lightColor);
    let $threshold = threshold

    return pixel(() => {
        const thresholdColor = ( $r + $g + $b ) <= $threshold ? $darkColor : $lightColor

        $r = thresholdColor.r
        $g = thresholdColor.g 
        $b = thresholdColor.b 
    }, {
        $threshold
    }, {
        $darkColor,
        $lightColor
    })
}


