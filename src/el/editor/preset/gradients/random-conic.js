
import { ColorStep } from "el/editor/property-parser/image-resource/ColorStep";
import { repeat } from "el/utils/func";

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