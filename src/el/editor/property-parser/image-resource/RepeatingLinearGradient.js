import { LinearGradient } from "./LinearGradient";

export class RepeatingLinearGradient extends LinearGradient {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "repeating-linear-gradient",
      angle: 0
    });
  }

  static parse(str) {
    var linear = LinearGradient.parse(str);
    return new RepeatingLinearGradient({
      angle: linear.angle,
      colorsteps: linear.colorsteps
    });
  }
}
