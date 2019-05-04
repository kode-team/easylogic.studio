import { Layer } from "../items/Layer";

export class Rect extends Layer {

    getDefaultTitle() {
        return 'Rectangle' 
    }

    getDefaultObject() {
        return super.getDefaultObject({ 
            type: 'rect' 
        })
    }
}  