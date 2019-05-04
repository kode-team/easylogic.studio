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
}
