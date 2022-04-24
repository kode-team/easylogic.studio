import { BaseSVGFilter } from "./BaseSVGFilter";

export class ColorMatrixSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "ColorMatrix",
      values: ColorMatrixSVGFilter.spec.values.defaultValue,
    });
  }

  getInCount() {
    return 1;
  }
  toString() {
    var { values } = this.json;

    var valueString = values.join(" ");

    return /*html*/ `<feColorMatrix type="matrix" values="${valueString}"  ${this.getDefaultAttribute()} />`;
  }
}

ColorMatrixSVGFilter.spec = {
  values: {
    title: "values",
    inputType: "color-matrix",
    column: 5,
    defaultValue: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  },
};
