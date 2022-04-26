import { PropertyItem } from "elf/editor/items/PropertyItem";
export class BoxImage extends PropertyItem {
  getDefaultObject() {
    return super.getDefaultObject({ itemType: "box-image" });
  }
}
