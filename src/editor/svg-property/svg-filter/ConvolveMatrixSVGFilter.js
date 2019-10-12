import { resultGenerator, BaseSVGFilter } from "./BaseSVGFilter";


export class ConvolveMatrixSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "ConvolveMatrix",
      sourceIn: ConvolveMatrixSVGFilter.spec.sourceIn.defaultValue,      
      kernelMatrix: ConvolveMatrixSVGFilter.spec.kernelMatrix.defaultValue,
    });
  }


  toString() {
    var { sourceIn, kernelMatrix } = this.json; 

    var valueString = kernelMatrix.join(' ')

    return `<feConvolveMatrix in="${sourceIn}" kernelMatrix="${valueString}"  ${this.getDefaultAttribute()} />`;
  }
}

ConvolveMatrixSVGFilter.spec = {
  sourceIn: {
    title: "in",
    inputType: "select",
    options: resultGenerator,
    defaultValue: "SourceGraphic"
  },
  kernelMatrix: {
    title: 'kernelMatrix',
    inputType: 'input-array',
    column: 3,
    defaultValue: [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ]
  },
  result: {
    title: 'result',
    inputType: 'text'
  }
};

