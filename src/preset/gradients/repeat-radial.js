import { repeat } from "@core/functions/func";
import { ColorStep } from "@property-parser/image-resource/ColorStep";

export default { 
    title: 'Repeat Radial', 
    key: 'repeat-radial', 
    execute: function (count = 42) {
        return repeat(count).map(it => {
            var shape = 'circle';

            return { 
                gradient: `repeating-radial-gradient(${shape}, ${ColorStep.createRepeatColorStep(3, '6px')})`
            }
        });
    }
}