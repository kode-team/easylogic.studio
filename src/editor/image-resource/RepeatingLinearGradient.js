import { LinearGradient } from "./LinearGradient";

export class RepeatingLinearGradient extends LinearGradient {
    getDefaultObject() {
        return super.getDefaultObject({ type: 'repeating-linear-gradient', angle: 0})
    }    
}
 