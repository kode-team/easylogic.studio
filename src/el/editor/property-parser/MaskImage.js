import { Property } from "../Property";

export class MaskImage extends PropertyItem {

    getDefaultObject() {
        return super.getDefaultObject({ itemType: 'mask-image' })
    }
} 