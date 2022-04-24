import { ColorStep } from "elf/editor/property-parser/image-resource/ColorStep";
import { randomItem, repeat } from "elf/utils/func";
const angle_list = ["0deg", "45deg", "90deg"];
export default {
  title: "Random Linear",
  key: "random-linear",
  execute: function (count = 42) {
    return repeat(count).map(() => {
      return {
        gradient: `linear-gradient(${randomItem(
          ...angle_list
        )}, ${ColorStep.createColorStep(10)})`,
      };
    });
  },
};
