import { Layer } from "../Layer";

export class VideoLayer extends Layer {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'video',
      name: "New Video",
      elementType: 'video',
      src: '',
      ...obj
    });
  }

  getDefaultTitle() {
    return "Video";
  }
 
}
