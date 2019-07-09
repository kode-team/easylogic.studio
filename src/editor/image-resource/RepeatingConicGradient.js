import { ConicGradient } from "./ConicGradient";
import { Position } from "../unit/Length";

export class RepeatingConicGradient extends ConicGradient {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "repeating-conic-gradient",
      angle: 0,
      radialPosition: [Position.CENTER, Position.CENTER]
    });
  }
  
  static parse(str) {
    var conic = ConicGradient.parse(str);

    return new RepeatingConicGradient({
      angle: conic.angle,
      radialPosition: conic.radialPosition,
      colorsteps: conic.colorsteps
    });
  }
}
