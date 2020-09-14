import { BaseSVGFilter } from "./BaseSVGFilter";
import { Length } from "@unit/Length";


export class DisplacementMapSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "DisplacementMap",
      scale: DisplacementMapSVGFilter.spec.scale.defaultValue
    });
  }

  getInCount() { return 2 }  

  convert (obj) {
    obj.scale = Length.parse(obj.scale)
    return obj; 
  }  

  toString() {
    var { scale } = this.json; 

    var scaleOption = scale.value ? `scale="${scale}"` : '';  

    return `<feDisplacementMap ${scaleOption}  ${this.getDefaultAttribute()} />`;
  }


  hasInIndex () {
    return true; 
  }
}

DisplacementMapSVGFilter.spec = {
  scale: {
    title: 'scale',
    inputType: 'number-range',
    min: 0,
    max: 5000,
    step: 1,
    defaultValue: Length.number(0)
  }
};
