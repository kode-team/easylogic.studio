import { resultGenerator, BaseSVGFilter } from "./BaseSVGFilter";

export class ColorMatrixSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "ColorMatrix",
      filterType: ColorMatrixSVGFilter.spec.filterType.defaultValue,
      sourceIn: ColorMatrixSVGFilter.spec.sourceIn.defaultValue,
      values: ColorMatrixSVGFilter.spec.values.defaultValue,
    });
  }

  toString() {
    var { sourceIn, filterType, values } = this.json; 

    var valueString = values.join(' ') 

    return `<feColorMatrix in="${sourceIn}" type="${filterType}" values="${valueString}"  ${this.getDefaultAttribute()} />`;
  }
}

ColorMatrixSVGFilter.spec = {
  sourceIn: {
    title: "in",
    inputType: "select",
    options: resultGenerator,
    defaultValue: "SourceGraphic"
  },
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
  },
  result: {
    title: 'result',
    inputType: 'text'
  }
};

