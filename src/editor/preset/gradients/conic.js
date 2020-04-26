import Color from "../../../util/Color";
import { repeat } from "../../../util/functions/func";
import { randomNumber } from "../../../util/functions/create";
import { ColorStep } from "../../image-resource/ColorStep";

export default { 
    title: 'Conic', 
    key: 'conic', 
    execute: function (count = 42) {
        return repeat(count).map(it => {
            var x = randomNumber(45, 55)
            var y = randomNumber(45, 55)
            var angle = randomNumber(0, 360)
            return { 
                gradient: `conic-gradient(from ${angle}deg at ${x}% ${y}%, ${ColorStep.createColorStep(2, 360, 'deg')})`
            }
        });
    }
}