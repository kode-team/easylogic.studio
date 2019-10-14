import { resultGenerator, BaseSVGFilter } from "./BaseSVGFilter";
import { Length } from "../../unit/Length";

export class MorphologySVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "Morphology",
      operator: MorphologySVGFilter.spec.operator.defaultValue,
      radius: MorphologySVGFilter.spec.radius.defaultValue
    });
  }
  getInCount() { return 1 }    

  toString() {
    var { operator, radius } = this.json; 
    return `<feMorphology operator="${operator}" radius="${radius}"  ${this.getDefaultAttribute()} />`;
  }
}


MorphologySVGFilter.spec = {
  operator: {
    title: "Operator",
    inputType: "select",
    options: 'erode,dilate',
    defaultValue: 'erode'
  },
  radius: {
    title: "Radius",
    inputType: "number-range",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: Length.number(0)
  }
};
