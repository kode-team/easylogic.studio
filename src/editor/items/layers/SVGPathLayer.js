import { Layer } from "../Layer";

export class SVGPathLayer extends Layer {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'svg-path',
      name: "New Canvas",
      elementType: 'path',
      ...obj
    });
  }

  getDefaultTitle() {
    return "Path";
  }

  get html () {
    var {id, path} = this.json;

    return `
      <path class='element-item  path' data-id="${id}">
      </path>
    `
  }
}
