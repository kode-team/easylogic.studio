import { BaseSVGFilter } from "./BaseSVGFilter";
import { OBJECT_TO_PROPERTY } from "@sapa/functions/func";
import { Length } from "@unit/Length";


export class DiffuseLightingSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "DiffuseLighting",
      surfaceScale: DiffuseLightingSVGFilter.spec.surfaceScale.defaultValue,      
      lightingColor: DiffuseLightingSVGFilter.spec.lightingColor.defaultValue,      
      diffuseConstant: DiffuseLightingSVGFilter.spec.diffuseConstant.defaultValue,
      lightInfo: '' 
    });
  }
  toCloneObject () {
    return {
      ...super.toCloneObject(),
      ...this.attrs(
        'surfaceScale',      
        'lightingColor',      
        'diffuseConstant',
        'lightInfo',
      )

    }
  }  

  hasLight() {
    return true; 
  }


  getInCount() { return 1 }  


  toString() {
    var { surfaceScale, diffuseConstant, lightingColor } = this.json; 

    return /*html*/`<feDiffuseLighting ${OBJECT_TO_PROPERTY({
      surfaceScale,
      diffuseConstant,
      'lighting-color': lightingColor
    })}  ${this.getDefaultAttribute()} >
      ${this.json.lightInfo}
    </feDiffuseLighting>`;
  }
}

DiffuseLightingSVGFilter.spec = {
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
  }
};

