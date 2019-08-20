import { Layer } from "../Layer";

export class SVGRectLayer extends Layer {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'svg-rect',
      name: "New Rect",
      elementType: 'rect',
      ...obj
    });
  }

  getDefaultTitle() {
    return "SVG Rect";
  }

  get html () {
    var {id, path} = this.json; 
  
    return `
      <rect class='element-item rect' data-id="${id}">
      </rect>
    `
  }
}
