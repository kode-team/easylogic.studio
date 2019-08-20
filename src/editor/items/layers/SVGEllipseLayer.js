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

    return `<ellipse class='element-item rect' data-id="${id}"></ellipse>`
  }
}
