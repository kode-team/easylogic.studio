import { Layer } from "../Layer";

export class SVGItem extends Layer {
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

  toCSS() {

  }

  toString() {
    return CSS_TO_STRING(this.toCSS());
  }

  toDefaultCSS(isExport = false) {

    return this.toKeyListCSS(
      'fill', 'fill-opacity','stroke', 'stroke-width', 
      'cy', 'cx', 'r', 'rx','ry'
    )
  }

  toCSS(isExport = false) {

    return {
      ...this.toVariableCSS(),
      ...this.toDefaultCSS(isExport),
      ...this.toTransformCSS(),      
      ...this.toAnimationCSS(),
      ...this.toTransitionCSS()
    };
  }
}
