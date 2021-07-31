import { ColorStep } from "el/editor/property-parser/image-resource/ColorStep";
import { repeat } from "el/utils/func";

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