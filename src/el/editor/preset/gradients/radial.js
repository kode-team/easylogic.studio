import { repeat } from "el/utils/func";
import { ColorStep } from "el/editor/property-parser/image-resource/ColorStep";

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