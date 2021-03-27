import { BaseSVGFilter } from "./BaseSVGFilter";
import { OBJECT_TO_PROPERTY } from "@sapa/functions/func";
import { Length } from "@unit/Length";


export class SpotLightSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "SpotLight",
      x: SpotLightSVGFilter.spec.x.defaultValue,      
      y: SpotLightSVGFilter.spec.x.defaultValue,      
      z: SpotLightSVGFilter.spec.x.defaultValue,      
      pointsAtX: SpotLightSVGFilter.spec.pointsAtX.defaultValue,      
      pointsAtY: SpotLightSVGFilter.spec.pointsAtY.defaultValue,      
      pointsAtZ: SpotLightSVGFilter.spec.pointsAtZ.defaultValue,      
      specularExponent: SpotLightSVGFilter.spec.specularExponent.defaultValue,
      limitingConeAngle: SpotLightSVGFilter.spec.limitingConeAngle.defaultValue
    });
  }


  isLight() {
    return true; 
  }

  // toString() {
  //   var { x, y, z, pointsAtX, pointsAtY, pointsAtZ, specularExponent, limitingConeAngle } = this.json; 

  //   return /*html*/`<feSpotLight ${OBJECT_TO_PROPERTY({
  //     x, y, z, pointsAtX, pointsAtY, pointsAtZ, specularExponent, limitingConeAngle
  //   })}  ${this.getDefaultAttribute()} />`;
  // }

  toString() { }

  toLightString() {
    var { x, y, z, pointsAtX, pointsAtY, pointsAtZ, specularExponent, limitingConeAngle } = this.json; 

    return /*html*/`<feSpotLight ${OBJECT_TO_PROPERTY({
      x, y, z, pointsAtX, pointsAtY, pointsAtZ, specularExponent, limitingConeAngle
    })} />`;
  }  
}

SpotLightSVGFilter.spec = {
 
  x: {
    title: "x",
    inputType: "number-range",
    min: 0,
    max: 1000,
    step: 1,
    defaultValue: Length.number(0)
  },
  y: {
    title: "y",
    inputType: "number-range",
    min: 0,
    max: 1000,
    step: 1,
    defaultValue: Length.number(0)
  },
  z: {
    title: "z",
    inputType: "number-range",
    min: 0,
    max: 1000,
    step: 1,
    defaultValue: Length.number(0)
  },
  pointsAtX: {
    title: "pointsAtX",
    inputType: "number-range",
    min: 0,
    max: 1000,
    step: 1,
    defaultValue: Length.number(0)
  },
  pointsAtY: {
    title: "pointsAtY",
    inputType: "number-range",
    min: 0,
    max: 1000,
    step: 1,
    defaultValue: Length.number(0)
  },
  pointsAtZ: {
    title: "pointsAtZ",
    inputType: "number-range",
    min: 0,
    max: 1000,
    step: 1,
    defaultValue: Length.number(0)
  },    
  specularExponent: {
    title: "specularExponent",
    inputType: "number-range",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: Length.number(1)
  },      
  limitingConeAngle: {
    title: "limitingConeAngle",
    inputType: "number-range",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: Length.number(1)
  }
};

