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

    console.log(path);

    var selected = this.json.selected ? 'selected' : ''

    return `
      <path class='element-item ${selected} path' data-id="${id}">
      </path>
    `
  }
}
