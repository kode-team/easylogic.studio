import { repeat, randomItem } from "../../../util/functions/func";
import { ColorStep } from "../../image-resource/ColorStep";
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