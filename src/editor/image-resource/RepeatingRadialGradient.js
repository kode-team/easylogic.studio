import { RadialGradient } from "./RadialGradient";

export class RepeatingRadialGradient extends RadialGradient {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "repeating-radial-gradient"
    });
  }
}
