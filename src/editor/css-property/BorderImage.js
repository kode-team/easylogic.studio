import { Property } from "../Property";

export class BorderImage extends Property {

    getDefaultObject() {
        return super.getDefaultObject({ itemType: 'border-image' })
    }
} 