import { Layer } from "../Layer";

export class SVGRectLayer extends Layer {

  static getIcon () {
    return icon.rect;
  }  
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
