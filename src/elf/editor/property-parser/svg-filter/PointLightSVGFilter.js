import { BaseSVGFilter } from "./BaseSVGFilter";
import { OBJECT_TO_PROPERTY } from "elf/utils/func";
import { Length } from "elf/editor/unit/Length";

export class PointLightSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "PointLight",
      x: PointLightSVGFilter.spec.x.defaultValue,
      y: PointLightSVGFilter.spec.y.defaultValue,
      z: PointLightSVGFilter.spec.z.defaultValue,
    });
  }

  isLight() {
    return true;
  }

  // toString() {
  //   var { x, y, z } = this.json;

  //   return /*html*/`<fePointLight ${OBJECT_TO_PROPERTY({
  //     x, y, z
  //   })}  ${this.getDefaultAttribute()} />`;
  // }

  toString() {
    return "";
  }

  toLightString() {
    var { x, y, z } = this.json;

    return /*html*/ `<fePointLight ${OBJECT_TO_PROPERTY({
      x,
      y,
      z,
    })} />`;
  }
}

PointLightSVGFilter.spec = {
  x: {
    title: "x",
    inputType: "number-range",
    min: 0,
    max: 1000,
    step: 1,
    defaultValue: Length.number(0),
  },
  y: {
    title: "y",
    inputType: "number-range",
    min: 0,
    max: 1000,
    step: 1,
    defaultValue: Length.number(0),
  },
  z: {
    title: "z",
    inputType: "number-range",
    min: 0,
    max: 1000,
    step: 1,
    defaultValue: Length.number(0),
  },
};
