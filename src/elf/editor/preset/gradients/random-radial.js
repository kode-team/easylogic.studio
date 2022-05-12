import { repeat } from "elf/core/func";
import { ColorStep } from "elf/editor/property-parser/image-resource/ColorStep";

export default {
  title: "Random Radial",
  key: "random-radial",
  execute: function (count = 42) {
    return repeat(count).map(() => {
      return {
        gradient: `radial-gradient(circle, ${ColorStep.createColorStep(10)})`,
      };
    });
  },
};
