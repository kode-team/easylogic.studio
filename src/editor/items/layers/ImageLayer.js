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
    return "Image";
  }

  resize() {
    this.reset({
      width: this.json.naturalWidth.clone(),
      height: this.json.naturalHeight.clone()
    })

  }

  get html () {
    var {id, src, itemType} = this.json;

    var selected = this.json.selected ? 'selected' : ''

    return `
      <img class='element-item ${selected} ${itemType}' data-id="${id}" src='${src}' />
    `
  }

}
 