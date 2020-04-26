import { repeat } from "../../../util/functions/func";
import { ColorStep } from "../../image-resource/ColorStep";

export default { 
    title: 'Random Radial', 
    key: 'random-radial', 
    execute: function (count = 42) {
        return repeat(count).map(it => {
            return { 
                gradient: `radial-gradient(circle, ${ColorStep.createColorStep(10)})`
            }
        });
    }
}