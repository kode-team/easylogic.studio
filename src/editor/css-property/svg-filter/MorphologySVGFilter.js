import { resultGenerator, BaseSVGFilter } from "./BaseSVGFilter";
import { Length } from "../../unit/Length";

export class MorphologySVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "Morphology",
      sourceIn: MorphologySVGFilter.spec.sourceIn.defaultValue,      
      operator: MorphologySVGFilter.spec.operator.defaultValue,
      radius: MorphologySVGFilter.spec.radius.defaultValue
    });
  }

  toString() {
    var { operator, radius, sourceIn } = this.json; 
    return `<feMorphology in="${sourceIn}"  operator="${operator}" radius="${radius}"  ${this.getDefaultAttribute()} />`;
  }
}


MorphologySVGFilter.spec = {
  sourceIn: {
    title: "in",
    inputType: "select",
    options: resultGenerator,
    defaultValue: "SourceGraphic"
  },  
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
  },  
  result: {
    title: 'result',
    inputType: 'text'
  }
};
