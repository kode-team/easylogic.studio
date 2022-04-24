import { BaseSVGFilter } from "./BaseSVGFilter";

export class ConvolveMatrixSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "ConvolveMatrix",
      kernelMatrix: ConvolveMatrixSVGFilter.spec.kernelMatrix.defaultValue,
    });
  }

  getInCount() {
    return 1;
  }

  toString() {
    var { kernelMatrix } = this.json;

    var valueString = kernelMatrix.join(" ");

    return /*html*/ `<feConvolveMatrix kernelMatrix="${valueString}"  ${this.getDefaultAttribute()} />`;
  }
}

ConvolveMatrixSVGFilter.spec = {
  kernelMatrix: {
    title: "kernelMatrix",
    inputType: "input-array",
    column: 3,
    defaultValue: [1, 0, 0, 0, 1, 0, 0, 0, 1],
  },
};
