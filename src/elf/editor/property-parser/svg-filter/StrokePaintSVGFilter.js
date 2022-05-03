import { SourceSVGFilter } from "./SourceSVGFilter";
export class StrokePaintSVGFilter extends SourceSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "StrokePaint",
    });
  }
}
