import { BaseSVGFilter } from "./BaseSVGFilter";
export class SourceSVGFilter extends BaseSVGFilter {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      type: "Source",
      ...obj,
    });
  }

  isSource() {
    return true;
  }
  toString() {
    return "";
  }
}
