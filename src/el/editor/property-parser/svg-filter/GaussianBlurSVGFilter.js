import { BaseSVGFilter } from "./BaseSVGFilter";
import { Length } from "el/editor/unit/Length";


export class GaussianBlurSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "GaussianBlur",
      stdDeviationX: GaussianBlurSVGFilter.spec.stdDeviationX.defaultValue,
      stdDeviationY: GaussianBlurSVGFilter.spec.stdDeviationY.defaultValue,
      edgeMode: GaussianBlurSVGFilter.spec.edgeMode.defaultValue
    });
  }


  getInCount() { return 1 }  


  convert (obj) {
    obj.stdDeviationX = Length.parse(obj.stdDeviationX)
    obj.stdDeviationY = Length.parse(obj.stdDeviationY)
    return obj; 
  }

  toString() {
    var { stdDeviationX, stdDeviationY, edgeMode } = this.json; 

    var stdDeviation = `${stdDeviationX} ${stdDeviationY}`
    if (stdDeviationX === stdDeviationY) {
      stdDeviation = stdDeviationX;
    }     

    return `<feGaussianBlur  stdDeviation="${stdDeviation}" edgeMode="${edgeMode}"  ${this.getDefaultAttribute()} />`;
  }
}

GaussianBlurSVGFilter.spec = {
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
  }
};


