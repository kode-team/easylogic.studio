import { repeat } from "@sapa/functions/func";
import { ColorStep } from "@property-parser/image-resource/ColorStep";

export default { 
    title: 'Radial', 
    key: 'radial', 
    execute: function (count = 42) {
        return repeat(count).map(it => {
            var shape = 'circle';

            return { 
                gradient: `radial-gradient(${shape}, ${ColorStep.createColorStep(2)})`
            }
        });
    }
}