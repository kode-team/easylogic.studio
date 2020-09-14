import Color from "@core/Color";
import { repeat } from "@core/functions/func";
import { randomNumber } from "@core/functions/create";
import { ColorStep } from "@property-parser/image-resource/ColorStep";

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