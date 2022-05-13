import { repeat } from "elf/core/func";
import { ColorStep } from "elf/editor/property-parser/image-resource/ColorStep";

export default {
  title: "Radial",
  key: "radial",
  execute: function (count = 42) {
    return repeat(count).map(() => {
      var shape = "circle";

      return {
        gradient: `radial-gradient(${shape}, ${ColorStep.createColorStep(2)})`,
      };
    });
  },
};
