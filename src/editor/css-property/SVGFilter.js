import { Length } from "../unit/Length";
import { Property } from "../items/Property";
import { WHITE_STRING } from "../../util/css/types";

export class SVGFilter extends Property {

  static parse (obj) {
    var FilterClass = SVGFilterClassName[obj.type];
  
    return new FilterClass(obj);
  }  


  getDefaultObject(obj = {}) {
    return super.getDefaultObject({ 
      itemType: "svgfilter", 
      result: '',
      ...obj 
    });
  }

  toString() {
    var { type , value } = this.json; 
    return `<fe${type} value="${value}" />`;
  }
}

export class GaussianBlurSVGFilter extends SVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "GaussianBlur",
      stdDeviation: GaussianBlurSVGFilter.spec.stdDeviation.defaultValue
    });
  }

  convert (obj) {
    obj.stdDeviation = Length.parse(obj.stdDeviation)
    return obj; 
  }

  toString() {
    var { stdDeviation } = this.json; 
    return `<feGaussianBlur stdDeviation="${stdDeviation}" />`;
  }
}


GaussianBlurSVGFilter.spec = {
  stdDeviation: {
    title: "stdDeviation",
    inputType: "number-range",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: Length.number(0)
  },
  result: {
    title: 'result',
    inputType: 'text'
  }
};


export class TurbulenceSVGFilter extends SVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "Turbulence",
      filterType: TurbulenceSVGFilter.spec.filterType.defaultValue,
      baseFrequency: TurbulenceSVGFilter.spec.baseFrequency.defaultValue,
      numOctaves: TurbulenceSVGFilter.spec.numOctaves.defaultValue,
      seed: TurbulenceSVGFilter.spec.seed.defaultValue
    });
  }

  convert (obj) {
    obj.baseFrequency = Length.parse(obj.baseFrequency)
    obj.numOctaves = Length.parse(obj.numOctaves)
    obj.seed = Length.parse(obj.seed)
    return obj; 
  }

  toString() {
    var { filterType, baseFrequency, numOctaves, seed, result } = this.json; 

    var resultOption = result ? `result="${result}"` : ''; 

    return `<feTurbulence type="${filterType}" baseFrequency="${baseFrequency}" numOctaves="${numOctaves}" seed="${seed}" ${resultOption} />`;
  }
}

TurbulenceSVGFilter.spec = {
  filterType: {
    title: "Type",
    inputType: "select",
    options: "fractalNoise,turbulence",
    defaultValue: "turbulence"
  },
  baseFrequency: {
    title: 'baseFrequency',
    inputType: 'number-range',
    min: 0,
    max: 1,
    step: 0.01,
    defaultValue: Length.number(0)
  },
  numOctaves: {
    title: 'numOctaves',
    inputType: 'number-range',
    min: -10,
    max: 10,
    step: 1,
    defaultValue: Length.number(1)
  },
  seed: {
    title: 'seed',
    inputType: 'number-range',
    min: 0,
    max: 10000,
    step: 1,
    defaultValue: Length.number(0)
  },
  result: {
    title: 'result',
    inputType: 'text'
  }
  
};



export class DisplacementMapSVGFilter extends SVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "DisplacementMap",
      sourceIn: DisplacementMapSVGFilter.spec.sourceIn.defaultValue,
      sourceInin2: DisplacementMapSVGFilter.spec.sourceIn2.defaultValue,
      scale: DisplacementMapSVGFilter.spec.scale.defaultValue
    });
  }

  convert (obj) {
    obj.scale = Length.parse(obj.scale)
    return obj; 
  }  

  toString() {
    var { sourceIn, sourceIn2, scale } = this.json; 

    var scaleOption = scale.value ? `scale="${scale}"` : '';

    return `<feDisplacementMap in="${sourceIn}" in2="${sourceIn2}" ${scaleOption} />`;
  }
}

DisplacementMapSVGFilter.spec = {
  sourceIn: {
    title: "in",
    inputType: "select",
    options: function (list) {
      var reference = list.filter(it => it.result).map(it => it.result).join(',')

      return `${reference},-,SourceGraphic,SourceAlpha,BackgroundImage,BackgroundAlpha,FillPaint,StrokePaint`
    },
    defaultValue: "SourceGraphic"
  },
  sourceIn2: {
    title: "in2",
    inputType: "select",
    options: function (list) {
      var reference = list.filter(it => it.result).map(it => it.result).join(',')

      return `${reference},-,SourceGraphic,SourceAlpha,BackgroundImage,BackgroundAlpha,FillPaint,StrokePaint`
    },
    defaultValue: "SourceGraphic"
  },
  scale: {
    title: 'scale',
    inputType: 'number-range',
    min: 0,
    max: 5000,
    step: 1,
    defaultValue: Length.number(0)
  },
  result: {
    title: 'result',
    inputType: 'text'
  }
};



export class ColorMatrixSVGFilter extends SVGFilter {
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

    var valueString = values.join(WHITE_STRING)

    return `<feColorMatrix in="${sourceIn}" type="${filterType}" values="${valueString}" />`;
  }
}

ColorMatrixSVGFilter.spec = {
  sourceIn: {
    title: "in",
    inputType: "select",
    options: function (list) {
      var reference = list.filter(it => it.result).map(it => it.result).join(',')

      return `${reference},-,SourceGraphic,SourceAlpha,BackgroundImage,BackgroundAlpha,FillPaint,StrokePaint`
    },
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



export class ConvolveMatrixSVGFilter extends SVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "ConvolveMatrix",
      sourceIn: ConvolveMatrixSVGFilter.spec.sourceIn.defaultValue,      
      kernelMatrix: ConvolveMatrixSVGFilter.spec.kernelMatrix.defaultValue,
    });
  }


  toString() {
    var { sourceIn, kernelMatrix } = this.json; 

    var valueString = kernelMatrix.join(WHITE_STRING)

    return `<feConvolveMatrix in="${sourceIn}" kernelMatrix="${valueString}" />`;
  }
}

ConvolveMatrixSVGFilter.spec = {
  sourceIn: {
    title: "in",
    inputType: "select",
    options: function (list) {
      var reference = list.filter(it => it.result).map(it => it.result).join(',')

      return `${reference},-,SourceGraphic,SourceAlpha,BackgroundImage,BackgroundAlpha,FillPaint,StrokePaint`
    },
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

export const SVGFilterClassList = [
  GaussianBlurSVGFilter,
  TurbulenceSVGFilter,
  DisplacementMapSVGFilter,
  ColorMatrixSVGFilter,
  ConvolveMatrixSVGFilter,
];

export const SVGFilterClassName = {
  GaussianBlur: GaussianBlurSVGFilter,
  Turbulence: TurbulenceSVGFilter,
  DisplacementMap: DisplacementMapSVGFilter,
  ColorMatrix: ColorMatrixSVGFilter,
  ConvolveMatrix: ConvolveMatrixSVGFilter,
};

export const SVGFilterClass = {
  GaussianBlurSVGFilter,
  TurbulenceSVGFilter,
  DisplacementMapSVGFilter,
  ColorMatrixSVGFilter,
  ConvolveMatrixSVGFilter
};
