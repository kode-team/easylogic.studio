import { repeat } from "@sapa/functions/func";
import { ColorStep } from "@property-parser/image-resource/ColorStep";

export default { 
    title: 'Random Conic', 
    key: 'random-conic', 
    execute: function (count = 42) {
        return repeat(count).map(it => {
            return { 
                gradient: `conic-gradient(from 0deg at 50% 50%, ${ColorStep.createColorStep(10, 360, 'deg')})`
            }
        });
    }
}