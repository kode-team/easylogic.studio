import {BaseSVGFilter } from "./BaseSVGFilter";
import { Length } from "el/editor/unit/Length";

export class CompositeSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "Composite",
      operator: CompositeSVGFilter.spec.operator.defaultValue,
      k1: CompositeSVGFilter.spec.k1.defaultValue,
      k2: CompositeSVGFilter.spec.k2.defaultValue,
      k3: CompositeSVGFilter.spec.k3.defaultValue,
      k4: CompositeSVGFilter.spec.k4.defaultValue
    });
  }

  getInCount() { return 2 }  

  toString() {
    var { operator, k1, k2, k3, k4 } = this.json; 

    var kNumbers = '' 

    if (operator === 'arithmetic') {
      kNumbers = ` k1="${k1}" k2="${k2}" k3="${k3}" k4="${k4}" `
    }

    return `<feComposite operator="${operator}" ${kNumbers}  ${this.getDefaultAttribute()} />`;
  }


  hasInIndex () {
    return true; 
  }
}


CompositeSVGFilter.spec = {  
  operator: {
    title: "operator",
    inputType: "select",
    options: "over,in,out,atop,xor,arithmetic",
    defaultValue: "over"
  },
  k1: {
    title: "k1",
    inputType: "number-range",
    min: 0,
    max: 1,
    step: 0.01,
    defaultValue: Length.number(0)
  },    
  k2: {
    title: "k2",
    inputType: "number-range",
    min: 0,
    max: 1,
    step: 0.01,
    defaultValue: Length.number(0)
  },    
  
  k3: {
    title: "k3",
    inputType: "number-range",
    min: 0,
    max: 1,
    step: 0.01,
    defaultValue: Length.number(0)
  },    
  
  k4: {
    title: "k4",
    inputType: "number-range",
    min: 0,
    max: 1,
    step: 0.01,
    defaultValue: Length.number(0)
  }
};


