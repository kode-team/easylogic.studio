import { BaseSVGFilter } from "./BaseSVGFilter";
import { Length } from "../../unit/Length";

export class HueRotateSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "HueRotate",
      values: HueRotateSVGFilter.spec.values.defaultValue,
    });
  }

  getInCount() { return 1 }
  
  toString() {
    var { values } = this.json;

    return /*html*/`<feColorMatrix type="hueRotate" values="${values}"  ${this.getDefaultAttribute()} />`;
  }
}

HueRotateSVGFilter.spec = {
  values: {
    title: "values",
    inputType: "number-range",
    min: 0,
    max: 360,
    step: 0.1,
    defaultValue: Length.number(0)
  }
};

