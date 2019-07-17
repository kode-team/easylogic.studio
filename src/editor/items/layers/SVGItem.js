import { Layer } from "../Layer";

export class SVGItem extends Layer {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'svg',
      name: "New SVG",
      elementType: 'svg',
      ...obj
    });
  }

  getDefaultTitle() {
    return "SVG";
  }
}
