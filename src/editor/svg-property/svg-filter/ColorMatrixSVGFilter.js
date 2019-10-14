import { resultGenerator, BaseSVGFilter } from "./BaseSVGFilter";

export class ColorMatrixSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "ColorMatrix",
      filterType: ColorMatrixSVGFilter.spec.filterType.defaultValue,
      values: ColorMatrixSVGFilter.spec.values.defaultValue,
    });
  }


  getInCount() { return 1 }
  toString() {
    var { filterType, values } = this.json; 

    var valueString = values.join(' ') 

    return /*html*/`<feColorMatrix type="${filterType}" values="${valueString}"  ${this.getDefaultAttribute()} />`;
  }
}

ColorMatrixSVGFilter.spec = {
  filterType: {
    title: "type",
    inputType: "select",
    options: 'matrix,saturate,hueRotate,luminanceToAlpha',
    defaultValue: "matrix"
  },
  values: {
    title: 'values',
    inputType: 'input-array',
    column: 5,
    defaultValue: [
      1, 0, 0, 0, 0,
      0, 1, 0, 0, 0,
      0, 0, 1, 0, 0,
      0, 0, 0, 1, 0
    ]
  }
};

