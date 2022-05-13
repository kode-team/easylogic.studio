import { randomItem, repeat } from "elf/core/func";
import { ColorStep } from "elf/editor/property-parser/image-resource/ColorStep";

const angle_list = ["0deg", "45deg", "90deg"];

export default {
  title: "Linear",
  key: "linear",
  execute: function (count = 42) {
    return repeat(count).map(() => {
      return {
        gradient: `linear-gradient(${randomItem(
          ...angle_list
        )}, ${ColorStep.createColorStep(2)})`,
      };
    });
  },
};
