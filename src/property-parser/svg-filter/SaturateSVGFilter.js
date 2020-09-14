import { BaseSVGFilter } from "./BaseSVGFilter";
import { Length } from "@unit/Length";

export class SaturateSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "Saturate",
      values: SaturateSVGFilter.spec.values.defaultValue,
    });
  }

  getInCount() { return 1 }

  toString() {
    var { values } = this.json; 

    return /*html*/`<feColorMatrix type="saturate" values="${values}"  ${this.getDefaultAttribute()} />`;
  }
}

SaturateSVGFilter.spec = {
  values: {
    title: "values",
    inputType: "number-range",
    min: -1,
    max: 1,
    step: 0.01,
    defaultValue: Length.number(0)
  }
};

