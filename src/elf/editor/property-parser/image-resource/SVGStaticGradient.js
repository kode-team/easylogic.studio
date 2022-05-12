import { ColorStep } from "./ColorStep";
import { SVGGradient } from "./SVGGradient";

export class SVGStaticGradient extends SVGGradient {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "static-gradient",
      colorsteps: [
        new ColorStep({ color: "red", percent: 0, index: 0 }),
        new ColorStep({ color: "red", percent: 100, index: 1 }),
      ],
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      static: true,
    };
  }

  static create(color = "transparent") {
    return new SVGStaticGradient({
      colorsteps: [
        new ColorStep({ color, percent: 0, index: 0 }),
        new ColorStep({ color, percent: 100, index: 0 }),
      ],
    });
  }

  setColor(color) {
    this.colorsteps.forEach((it) => {
      it.color = color;
    });
  }

  toString() {
    var color = this.json.colorsteps[0].color;
    return color;
  }

  toSVGString() {
    return "";
  }

  toFillValue() {
    return this.toString();
  }
}
