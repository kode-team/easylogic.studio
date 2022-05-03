import { SourceSVGFilter } from "./SourceSVGFilter";
export class SourceGraphicSVGFilter extends SourceSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "SourceGraphic",
    });
  }
}
