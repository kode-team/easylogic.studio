import { Property } from "../Property";

export class BoxImage extends PropertyItem {

    getDefaultObject() {
        return super.getDefaultObject({ itemType: 'box-image' })
    }
} 