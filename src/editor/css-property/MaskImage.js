import { Property } from "../Property";

export class MaskImage extends Property {

    getDefaultObject() {
        return super.getDefaultObject({ itemType: 'mask-image' })
    }
} 