import { BaseSVGFilter } from "./BaseSVGFilter";

export class LuminanceAlphaSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "LuminanceAlpha",
    });
  }

  getInCount() {
    return 1;
  }

  toString() {
    return /*html*/ `<feColorMatrix type="luminanceToAlpha" ${this.getDefaultAttribute()} />`;
  }
}

LuminanceAlphaSVGFilter.spec = {};
