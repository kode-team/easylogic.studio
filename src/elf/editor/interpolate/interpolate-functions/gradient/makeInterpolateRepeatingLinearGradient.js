import { makeInterpolateLinearGradient } from "./makeInterpolateLinearGradient";

import { RepeatingLinearGradient } from "elf/editor/property-parser/image-resource/RepeatingLinearGradient";

export function makeInterpolateRepeatingLinearGradient(layer, property, s, e) {
  var func = makeInterpolateLinearGradient(layer, property, s, e);

  return (rate, t) => {
    var obj = func(rate, t);
    var results = new RepeatingLinearGradient({
      angle: obj.angle,
      colorsteps: obj.colorsteps,
    });

    return results;
  };
}
