import { BaseSVGFilter } from "./BaseSVGFilter";
import { OBJECT_TO_PROPERTY } from "el/utils/func";
import { Length } from "el/editor/unit/Length";


export class DropShadowSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "DropShadow",
      dx: DropShadowSVGFilter.spec.dx.defaultValue,      
      dy: DropShadowSVGFilter.spec.dy.defaultValue,
      stdDeviation: DropShadowSVGFilter.spec.stdDeviation.defaultValue,
      color: DropShadowSVGFilter.spec.color.defaultValue,
      opacity: DropShadowSVGFilter.spec.opacity.defaultValue,
    });
  }

  getInCount() {
    return 1; 
  }

  toString() {
    var { dx, dy, stdDeviation, color, opacity } = this.json; 

    return /*html*/`<feDropShadow ${OBJECT_TO_PROPERTY({
      dx, dy, stdDeviation, 'flood-color': color, 'flood-opacity': opacity
    })}  ${this.getDefaultAttribute()} />`;
  }
}

DropShadowSVGFilter.spec = {
 
  dx: {
    title: "dx",
    inputType: "number-range",
    min: 0,
    max: 1000,
    step: 1,
    defaultValue: Length.number(0)
  },
  dy: {
    title: "dy",
    inputType: "number-range",
    min: 0,
    max: 1000,
    step: 1,
    defaultValue: Length.number(0)
  },        
  stdDeviation: {
    title: "stdDeviation",
    inputType: "number-range",
    min: 0,
    max: 1000,
    step: 0.1,
    defaultValue: Length.number(0)
  },  
  opacity: {
    title: "opacity",
    inputType: "number-range",
    min: 0,
    max: 1,
    step: 0.01,
    defaultValue: Length.number(1)
  },

  color: {
    title: "color",
    inputType: "color",
    defaultValue: 'rgba(0, 0, 0, 1)'
  }
};

