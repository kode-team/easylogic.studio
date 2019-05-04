import { pixel } from "../functions";


export default function (redTint = 1, greenTint = 1, blueTint = 1) {
    const $redTint = parseParamNumber(redTint)       
    const $greenTint = parseParamNumber(greenTint)       
    const $blueTint = parseParamNumber(blueTint)       
    return pixel(() => {

        $r += (255 - $r) * $redTint
        $g += (255 - $g) * $greenTint
        $b += (255 - $b) * $blueTint

    }, {
        $redTint, 
        $greenTint,
        $blueTint
    })

} 