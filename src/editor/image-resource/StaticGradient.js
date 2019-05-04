import { Gradient } from "./Gradient";
import { ColorStep } from "./ColorStep";

export class StaticGradient extends Gradient {
    getDefaultObject() {
        return super.getDefaultObject({  
            type: 'static-gradient', 
            static: true, 
            colorsteps: [
                new ColorStep({color: 'red', percent: 0, index: 0})
            ]
        }) 
    }

    toString () {
        var color = this.json.colorsteps[0].color;
        return `linear-gradient(to right, ${color}, ${color})`
    }

    isStatic () { return true; }
}
