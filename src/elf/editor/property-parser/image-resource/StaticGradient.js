import { ColorStep } from "./ColorStep";
import { Gradient } from "./Gradient";

import { parseOneValue } from "elf/utils/css-function-parser";

export class StaticGradient extends Gradient {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "static-gradient",
      static: true,
      colorsteps: [
        new ColorStep({ color: "red", percent: 0, index: 0 }),
        new ColorStep({ color: "red", percent: 100, index: 0 }),
      ],
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      static: true,
    };
  }

  static parse(str) {
    const result = parseOneValue(str);

    var colorsteps = Gradient.parseColorSteps(result.parameters);

    return new StaticGradient({ colorsteps });
  }

  static create(color = "transparent") {
    return new StaticGradient({
      colorsteps: [
        new ColorStep({ color, percent: 0, index: 0 }),
        new ColorStep({ color, percent: 100, index: 1 }),
      ],
    });
  }

  toString() {
    var color = this.json.colorsteps[0].color;
    return `static-gradient(${color})`;
  }

  toCSSString() {
    if (this.colorsteps.length === 0) return "";

    const color = this.colorsteps[0].color || "black";

    return `linear-gradient(${color} 0%, ${color} 100%)`;
  }
}
