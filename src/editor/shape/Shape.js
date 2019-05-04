import { Layer } from "../items/Layer";

export class Shape extends Layer {

    getDefaultTitle() {
        return 'Shape'
    } 

    getDefaultObject() {
        return super.getDefaultObject({ type: 'shape' })
    }
}  