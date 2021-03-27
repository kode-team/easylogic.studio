import { BaseSVGFilter } from "./BaseSVGFilter";
import { Length } from "@unit/Length";
import { OBJECT_TO_PROPERTY } from "@sapa/functions/func";

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

    return /*html*/`<feTurbulence ${OBJECT_TO_PROPERTY({
      type: filterType,
      baseFrequency,
      numOctaves, 
      seed
    })}   ${this.getDefaultAttribute()} />`;
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
    title: 'Frequency',
    inputType: 'number-range',
    min: 0,
    max: 1,
    step: 0.01,
    defaultValue: Length.number(0)
  },
  numOctaves: {
    title: 'Octaves',
    inputType: 'number-range',
    min: 1,
    max: 10,
    step: 1,
    defaultValue: Length.number(1)
  },
  seed: {
    title: 'Seed',
    inputType: 'number-range',
    min: 0,
    max: 10000,
    step: 1,
    defaultValue: Length.number(0)
  }
  
};
