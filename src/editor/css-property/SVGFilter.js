import { Length } from "../unit/Length";
import { Property } from "../items/Property";

export class SVGFilter extends Property {

  static parse (obj) {
    var FilterClass = SVGFilterClassName[obj.type];
  
    return new FilterClass(obj);
  }  


  getDefaultObject(obj = {}) {
    return super.getDefaultObject({ itemType: "svgfilter", ...obj });
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
    inputType: "range",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: Length.number(0),
    unit: 'number',
    units: ["number"]
  }
};

export const SVGFilterClassList = [
  GaussianBlurSVGFilter
];

export const SVGFilterClassName = {
  GaussianBlur: GaussianBlurSVGFilter,
};

export const SVGFilterClass = {
  GaussianBlurSVGFilter
};
