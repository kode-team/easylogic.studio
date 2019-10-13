import { resultGenerator, BaseSVGFilter } from "./BaseSVGFilter";
import { Length } from "../../unit/Length";
import { OBJECT_TO_PROPERTY } from "../../../util/functions/func";

export class OffsetSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "Offset",
      sourceIn: OffsetSVGFilter.spec.sourceIn.defaultValue,      
      dx: OffsetSVGFilter.spec.dx.defaultValue,
      dy: OffsetSVGFilter.spec.dy.defaultValue
    });
  }

  toString() {
    var { sourceIn, dx, dy } = this.json; 
    return /*html*/`<feOffset 
      ${OBJECT_TO_PROPERTY({
        in: sourceIn,
        dx, dy 
      })}  ${this.getDefaultAttribute()} />`;
  }
}


OffsetSVGFilter.spec = {
  sourceIn: {
    title: "in",
    inputType: "select",
    options: resultGenerator,
    defaultValue: "SourceGraphic"
  },  
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
  result: {
    title: 'result',
    inputType: 'text'
  }
};
