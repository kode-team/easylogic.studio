import { repeat } from "../../../util/functions/func";
import { ColorStep } from "../../image-resource/ColorStep";

export default { 
    title: 'Raidal', 
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