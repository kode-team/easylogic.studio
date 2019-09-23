import { Gradient } from "./Gradient";
import { ColorStep } from "./ColorStep";

export class StaticGradient extends Gradient {
    getDefaultObject() {
        return super.getDefaultObject({  
            type: 'static-gradient', 
            static: true, 
            colorsteps: [
                new ColorStep({color: 'red', percent: 0, index: 0}),
                new ColorStep({color: 'red', percent: 100, index: 0})
            ]
        }) 
    }

    toCloneObject() {
        return {
            ...super.toCloneObject(),
            static: true 
        }
    }

    static create (color = 'transparent') {
        return new StaticGradient({
            colorsteps: [
                new ColorStep({color, percent: 0, index: 0}),
                new ColorStep({color, percent: 100, index: 1})
            ]
        })
    }

    toString () {
        var color = this.json.colorsteps[0].color;
        return `linear-gradient(to right, ${color} 0%, ${color} 100%)`
    }

    isStatic () { return true; }
}
