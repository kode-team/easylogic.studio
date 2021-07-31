import { BaseSVGFilter } from "./BaseSVGFilter";
import { OBJECT_TO_PROPERTY } from "el/utils/func";
import { Length } from "el/editor/unit/Length";


export class DistantLightSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "DistantLight",
      azimuth: DistantLightSVGFilter.spec.azimuth.defaultValue,      
      elevation: DistantLightSVGFilter.spec.elevation.defaultValue
    });
  }

  isLight() {
    return true; 
  }


  // toString() {
  //   var { azimuth, elevation } = this.json; 

  //   return /*html*/`<feDistantLight ${OBJECT_TO_PROPERTY({
  //     azimuth, elevation
  //   })}  ${this.getDefaultAttribute()} />`;
  // }


  toString() {
    return '';
  }

  toLightString() {
    var { azimuth, elevation } = this.json; 

    return /*html*/`<feDistantLight ${OBJECT_TO_PROPERTY({
      azimuth, elevation
    })} />`;
  }
}

DistantLightSVGFilter.spec = {
 
  azimuth: {
    title: "azimuth",
    inputType: "number-range",
    min: 0,
    max: 1000,
    step: 1,
    defaultValue: Length.number(0)
  },
  elevation: {
    title: "elevation",
    inputType: "number-range",
    min: 0,
    max: 1000,
    step: 1,
    defaultValue: Length.number(0)
  }
};

