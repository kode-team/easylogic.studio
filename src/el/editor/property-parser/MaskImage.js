import { PropertyItem } from 'el/editor/items/PropertyItem';
export class MaskImage extends PropertyItem {
    getDefaultObject() {
        return super.getDefaultObject({ itemType: 'mask-image' })
    }
} 