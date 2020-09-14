import { repeat } from "@core/functions/func";
import { ColorStep } from "@property-parser/image-resource/ColorStep";

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