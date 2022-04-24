import { BaseSVGFilter } from "./BaseSVGFilter";
import { Length } from "elf/editor/unit/Length";
import { OBJECT_TO_PROPERTY } from "elf/utils/func";

export class OffsetSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "Offset",
      dx: OffsetSVGFilter.spec.dx.defaultValue,
      dy: OffsetSVGFilter.spec.dy.defaultValue,
    });
  }

  getInCount() {
    return 1;
  }

  toString() {
    var { dx, dy } = this.json;
    return /*html*/ `<feOffset 
      ${OBJECT_TO_PROPERTY({
        dx,
        dy,
      })}  ${this.getDefaultAttribute()} />`;
  }
}

OffsetSVGFilter.spec = {
  dx: {
    title: "dx",
    inputType: "number-range",
    min: 0,
    max: 1000,
    step: 1,
    defaultValue: Length.number(0),
  },
  dy: {
    title: "dy",
    inputType: "number-range",
    min: 0,
    max: 1000,
    step: 1,
    defaultValue: Length.number(0),
  },
};
