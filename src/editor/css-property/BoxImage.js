import { Property } from "../Property";

export class BoxImage extends Property {

    getDefaultObject() {
        return super.getDefaultObject({ itemType: 'box-image' })
    }
} 