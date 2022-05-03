import { SourceSVGFilter } from "./SourceSVGFilter";
export class BackgroundImageSVGFilter extends SourceSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "BackgroundImage",
    });
  }
}
