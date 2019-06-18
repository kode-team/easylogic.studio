import { Layer } from "../Layer";

export class ImageLayer extends Layer {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'image',
      name: "New Image",
      elementType: 'image',
      src: '',
      ...obj
    });
  }

  getDefaultTitle() {
    return "Layer";
  }

}
