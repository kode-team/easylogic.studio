import { Layer } from "../Layer";

export class SVGEllipseLayer extends Layer {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'svg-ellipse',
      name: "New Ellipse",
      elementType: 'ellipse',
      ...obj
    });
  }

  getDefaultTitle() {
    return "SVG Ellipse";
  }

  get html () {
    var {id, path} = this.json;

    console.log(path);

    var selected = this.json.selected ? 'selected' : ''

    return `<ellipse class='element-item ${selected} rect' data-id="${id}"></ellipse>`
  }
}
