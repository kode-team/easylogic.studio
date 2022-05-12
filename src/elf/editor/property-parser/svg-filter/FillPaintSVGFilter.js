import { SourceSVGFilter } from "./SourceSVGFilter";
export class FillPaintSVGFilter extends SourceSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "FillPaint",
    });
  }
}
