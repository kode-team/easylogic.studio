import { Layer } from "../Layer";

export class CanvasLayer extends Layer {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'canvas',
      name: "New Canvas",
      elementType: 'canvas',
      src: '',
      ...obj
    });
  }

  getDefaultTitle() {
    return "Canvas";
  } 

}
