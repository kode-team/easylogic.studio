import { repeat, randomItem } from "@core/functions/func";
import { ColorStep } from "@property-parser/image-resource/ColorStep";
const angle_list = ['0deg', '45deg', '90deg']
export default { 
    title: 'Random Linear', 
    key: 'random-linear', 
    execute: function (count = 42) {
        return repeat(count).map(it => {
            return { 
                gradient: `linear-gradient(${randomItem(...angle_list)}, ${ColorStep.createColorStep(10)})`
            }
        });
    }
}