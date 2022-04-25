import { BaseSVGFilter } from "./BaseSVGFilter";

import { OBJECT_TO_PROPERTY } from "elf/core/func";

export class BlendSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "Blend",
      mode: BlendSVGFilter.spec.mode.defaultValue,
    });
  }

  getInCount() {
    return 2;
  }

  toString() {
    var { mode } = this.json;

    return /*html*/ `<feBlend ${OBJECT_TO_PROPERTY({
      mode,
    })} ${this.getDefaultAttribute()} />`;
  }

  hasInIndex() {
    return true;
  }
}

BlendSVGFilter.spec = {
  mode: {
    title: "mode",
    inputType: "blend",
    defaultValue: "normal",
  },
};
