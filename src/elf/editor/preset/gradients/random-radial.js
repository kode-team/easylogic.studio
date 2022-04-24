import { ColorStep } from "elf/editor/property-parser/image-resource/ColorStep";
import { repeat } from "elf/utils/func";

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
