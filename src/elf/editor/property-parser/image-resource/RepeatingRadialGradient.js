import { RadialGradient } from "./RadialGradient";

export class RepeatingRadialGradient extends RadialGradient {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "repeating-radial-gradient",
    });
  }

  static parse(str) {
    var radial = RadialGradient.parse(str);

    return new RepeatingRadialGradient({
      radialType: radial.radialType,
      radialSize: radial.radialSize,
      radialPosition: radial.radialPosition,
      colorsteps: radial.colorsteps,
    });
  }
}
