import { Layer } from "../Layer";

export class SVGLayer extends Layer {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'svg',
      name: "New Canvas",
      elementType: 'svg',
      src: '',
      ...obj
    });
  }

  getDefaultTitle() {
    return "SVG";
  }


  get html () {
    var {id, layers} = this.json;

    return `
    <svg class='element-item svg' data-id="${id}">
        ${layers.map(it => it.html).join('')}
    </svg>
    `
  }
}
