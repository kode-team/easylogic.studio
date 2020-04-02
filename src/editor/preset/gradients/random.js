import { Gradient } from "../../image-resource/Gradient";

export default { 
    title: 'random', 
    key: 'random', 
    execute: function (count = 20) {
        return Gradient.randomByCount(count).map(gradient => {
            return { gradient }
        });
    }
}