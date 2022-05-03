import { randomItem, repeat } from "elf/core/func";
import { ColorStep } from "elf/editor/property-parser/image-resource/ColorStep";

const angle_list = ["0deg", "45deg", "90deg"];

export default {
  title: "Repeat Linear",
  key: "repeat-linear",
  execute: function (count = 42) {
    return repeat(count).map(() => {
      return {
        gradient: `repeating-linear-gradient(${randomItem(
          ...angle_list
        )}, ${ColorStep.createRepeatColorStep(2, "10px")})`,
      };
    });
  },
};
