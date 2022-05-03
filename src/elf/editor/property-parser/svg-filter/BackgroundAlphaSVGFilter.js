import { SourceSVGFilter } from "./SourceSVGFilter";
export class BackgroundAlphaSVGFilter extends SourceSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "BackgroundAlpha",
    });
  }
}
