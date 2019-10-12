import { resultGenerator, BaseSVGFilter } from "./BaseSVGFilter";
import { Length } from "../../unit/Length";


export class DisplacementMapSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "DisplacementMap",
      sourceIn: DisplacementMapSVGFilter.spec.sourceIn.defaultValue,
      sourceIn2: DisplacementMapSVGFilter.spec.sourceIn2.defaultValue,
      scale: DisplacementMapSVGFilter.spec.scale.defaultValue
    });
  }

  convert (obj) {
    obj.scale = Length.parse(obj.scale)
    return obj; 
  }  

  toString() {
    var { sourceIn, sourceIn2, scale } = this.json; 

    var scaleOption = scale.value ? `scale="${scale}"` : '';  

    return `<feDisplacementMap in="${sourceIn}" in2="${sourceIn2}" ${scaleOption}  ${this.getDefaultAttribute()} />`;
  }
}

DisplacementMapSVGFilter.spec = {
  sourceIn: {
    title: "in",
    inputType: "select",
    options: resultGenerator,
    defaultValue: "SourceGraphic"
  },
  sourceIn2: {
    title: "in2",
    inputType: "select",
    options: resultGenerator,
    defaultValue: "SourceGraphic"
  },
  scale: {
    title: 'scale',
    inputType: 'number-range',
    min: 0,
    max: 5000,
    step: 1,
    defaultValue: Length.number(0)
  },
  result: {
    title: 'result',
    inputType: 'text'
  }
};
