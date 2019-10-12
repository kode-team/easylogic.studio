import { resultGenerator, BaseSVGFilter } from "./BaseSVGFilter";
import { Length } from "../../unit/Length";

export class TurbulenceSVGFilter extends BaseSVGFilter {
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
    var { filterType, baseFrequency, numOctaves, seed } = this.json; 

    return `<feTurbulence type="${filterType}" baseFrequency="${baseFrequency}" numOctaves="${numOctaves}" seed="${seed}"  ${this.getDefaultAttribute()} />`;
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
    min: 1,
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
