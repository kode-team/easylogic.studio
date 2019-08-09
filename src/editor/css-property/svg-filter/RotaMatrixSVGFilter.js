import { resultGenerator, BaseSVGFilter } from "./BaseSVGFilter";
import { Length } from "../../unit/Length";


export class RotaMatrixSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "RotaMatrix",
      hueRotate: RotaMatrixSVGFilter.spec.hueRotate.defaultValue
    });
  }

  convert(json) {
    json.hueRotate = Length.parse(json.hueRotate);
    return json 
  }

  toString() {
    var {id, hueRotate} = this.json 
    return `
      <feColorMatrix type="hueRotate" result="romatrix-${id}"  values="${hueRotate}"/>
      <feColorMatrix type="matrix" in="romatrix-${id}" in2="SourceGraphic"  ${this.getDefaultAttribute()} values="-1 2 -3 0 -.5 2 1 0 0 0 0 3 1 0 0 0 0 1 1 0"/>
    `;
  }
}


RotaMatrixSVGFilter.spec = {
  hueRotate: {
    title: "hue-rotate",
    inputType: "number-range",
    min: 0,
    max: 360,
    step: 1,
    defaultValue: Length.number(0)
  },    
  result: {
    title: 'result',
    inputType: 'text'
  }
};
