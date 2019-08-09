import { resultGenerator, BaseSVGFilter } from "./BaseSVGFilter";
import { Length } from "../../unit/Length";


export class GaussianBlurSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "GaussianBlur",
      sourceIn: GaussianBlurSVGFilter.spec.sourceIn.defaultValue,      
      stdDeviationX: GaussianBlurSVGFilter.spec.stdDeviationX.defaultValue,
      stdDeviationY: GaussianBlurSVGFilter.spec.stdDeviationY.defaultValue,
      edgeMode: GaussianBlurSVGFilter.spec.edgeMode.defaultValue
    });
  }

  convert (obj) {
    obj.stdDeviationX = Length.parse(obj.stdDeviationX)
    obj.stdDeviationY = Length.parse(obj.stdDeviationY)
    return obj; 
  }

  toString() {
    var { stdDeviationX, stdDeviationY, edgeMode, sourceIn } = this.json; 

    var stdDeviation = `${stdDeviationX} ${stdDeviationY}`
    if (stdDeviationX === stdDeviationY) {
      stdDeviation = stdDeviationX;
    }     

    return `<feGaussianBlur in="${sourceIn}"  stdDeviation="${stdDeviation}" edgeMode="${edgeMode}"  ${this.getDefaultAttribute()} />`;
  }
}

GaussianBlurSVGFilter.spec = {
  sourceIn: {
    title: "in",
    inputType: "select",
    options: resultGenerator,
    defaultValue: "SourceGraphic"
  },  
  stdDeviationX: {
    title: "X",
    inputType: "number-range",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: Length.number(0)
  },
  stdDeviationY: {
    title: "Y",
    inputType: "number-range",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: Length.number(0)
  },  
  edgeMode: {
    title: "edge",
    inputType: "select",
    options: "none,duplicate,wrap",
    defaultValue: "none"
  },
  result: {
    title: 'result',
    inputType: 'text'
  }
};


