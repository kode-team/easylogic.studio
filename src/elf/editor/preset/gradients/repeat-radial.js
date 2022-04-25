import { repeat } from "elf/core/func";
import { ColorStep } from "elf/editor/property-parser/image-resource/ColorStep";

export default {
  title: "Repeat Radial",
  key: "repeat-radial",
  execute: function (count = 42) {
    return repeat(count).map(() => {
      var shape = "circle";

      return {
        gradient: `repeating-radial-gradient(${shape}, ${ColorStep.createRepeatColorStep(
          3,
          "6px"
        )})`,
      };
    });
  },
};
