import { PropertyItem } from "elf/editor/items/PropertyItem";
export class MaskImage extends PropertyItem {
  getDefaultObject() {
    return super.getDefaultObject({ itemType: "mask-image" });
  }
}
