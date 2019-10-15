import { BaseSVGFilter } from "./BaseSVGFilter";
import { OBJECT_TO_PROPERTY } from "../../../util/functions/func";
import { Length } from "../../unit/Length";


export class DistanceLightSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "DistanceLight",
      azimuth: DistanceLightSVGFilter.spec.azimuth.defaultValue,      
      elevation: DistanceLightSVGFilter.spec.elevation.defaultValue
    });
  }

  isLight() {
    return true; 
  }


  // toString() {
  //   var { azimuth, elevation } = this.json; 

  //   return /*html*/`<feDistanceLight ${OBJECT_TO_PROPERTY({
  //     azimuth, elevation
  //   })}  ${this.getDefaultAttribute()} />`;
  // }


  toString() {
    return '';
  }

  toLightString() {
    var { azimuth, elevation } = this.json; 

    return /*html*/`<feDistanceLight ${OBJECT_TO_PROPERTY({
      azimuth, elevation
    })} />`;
  }
}

DistanceLightSVGFilter.spec = {
 
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

