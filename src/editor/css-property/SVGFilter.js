import { Length } from "../unit/Length";
import { Property } from "../items/Property";

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
  }
};

export const SVGFilterClassList = [
  GaussianBlurSVGFilter,
  TurbulenceSVGFilter,
  DisplacementMapSVGFilter
];

export const SVGFilterClassName = {
  GaussianBlur: GaussianBlurSVGFilter,
  Turbulence: TurbulenceSVGFilter,
  DisplacementMap: DisplacementMapSVGFilter
};

export const SVGFilterClass = {
  GaussianBlurSVGFilter,
  TurbulenceSVGFilter,
  DisplacementMapSVGFilter
};
