import { resultGenerator, BaseSVGFilter } from "./BaseSVGFilter";
import { OBJECT_TO_PROPERTY } from "../../../util/functions/func";
import { Length } from "../../unit/Length";


export class DiffuseLightingSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "DiffuseLighting",
      sourceIn: DiffuseLightingSVGFilter.spec.sourceIn.defaultValue,      
      surfaceScale: DiffuseLightingSVGFilter.spec.surfaceScale.defaultValue,      
      lightingColor: DiffuseLightingSVGFilter.spec.lightingColor.defaultValue,      
      diffuseConstant: DiffuseLightingSVGFilter.spec.diffuseConstant.defaultValue
    });
  }


  toString() {
    var { sourceIn, surfaceScale, diffuseConstant, lightingColor } = this.json; 

    return /*html*/`<feDiffuseLighting ${OBJECT_TO_PROPERTY({
      in: sourceIn,
      surfaceScale,
      diffuseConstant,
      'lighting-color': lightingColor
    })}  ${this.getDefaultAttribute()} >
    
    </feDiffuseLighting>`;
  }
}

DiffuseLightingSVGFilter.spec = {
  sourceIn: {
    title: "in",
    inputType: "select",
    options: resultGenerator,
    defaultValue: "SourceGraphic"
  },
  surfaceScale: {
    title: "surfaceScale",
    inputType: "number-range",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: Length.number(1)
  },
  diffuseConstant: {
    title: "diffuseConstant",
    inputType: "number-range",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: Length.number(1)
  },  
 
  lightingColor: {
    title: "Lighting Color",
    inputType: "color",
    defaultValue: 'rgba(0, 0, 0, 1)'
  },   
  result: {
    title: 'result',
    inputType: 'text'
  }
};

