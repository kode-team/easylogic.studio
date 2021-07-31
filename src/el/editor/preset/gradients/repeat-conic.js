import { ColorStep } from "el/editor/property-parser/image-resource/ColorStep";
import { repeat } from "el/utils/func";

export default { 
    title: 'Repeat Conic', 
    key: 'repeat-conic', 
    execute: function (count = 42) {
        return repeat(count).map(it => {
            return { 
                gradient: `repeating-conic-gradient(from 0deg at 0% 50%, ${ColorStep.createRepeatColorStep(10, '10deg')})`
            }
        });
    }
}