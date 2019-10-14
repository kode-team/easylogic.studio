import { BaseSVGFilter } from "./BaseSVGFilter";
import { OBJECT_TO_PROPERTY } from "../../../util/functions/func";
import { Length } from "../../unit/Length";


export class PointLightSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "PointLight",
      x: PointLightSVGFilter.spec.x.defaultValue,      
      y: PointLightSVGFilter.spec.y.defaultValue,      
      z: PointLightSVGFilter.spec.z.defaultValue
    });
  }


  toString() {
    var { x, y, z } = this.json; 

    return /*html*/`<fePointLight ${OBJECT_TO_PROPERTY({
      x, y, z
    })}  ${this.getDefaultAttribute()} />`;
  }
}

PointLightSVGFilter.spec = {
  x: {
    title: "x",
    inputType: "number-range",
    min: 0,
    max: 1000,
    step: 1,
    defaultValue: Length.number(0)
  },
  y: {
    title: "y",
    inputType: "number-range",
    min: 0,
    max: 1000,
    step: 1,
    defaultValue: Length.number(0)
  },
  z: {
    title: "z",
    inputType: "number-range",
    min: 0,
    max: 1000,
    step: 1,
    defaultValue: Length.number(0)
  }
};

