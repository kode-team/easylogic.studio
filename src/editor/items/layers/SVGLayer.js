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

    var selected = this.json.selected ? 'selected' : ''

    return `
    <svg class='element-item ${selected} svg' data-id="${id}">
        ${layers.map(it => it.html).join('')}
    </svg>
    `
  }
}
