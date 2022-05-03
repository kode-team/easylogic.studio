import { SourceSVGFilter } from "./SourceSVGFilter";
export class SourceAlphaSVGFilter extends SourceSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "SourceAlpha",
    });
  }
}
