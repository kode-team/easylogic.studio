import { repeat } from "elf/core/func";
import { ColorStep } from "elf/editor/property-parser/image-resource/ColorStep";

export default {
  title: "Random Conic",
  key: "random-conic",
  execute: function (count = 42) {
    return repeat(count).map(() => {
      return {
        gradient: `conic-gradient(from 0deg at 50% 50%, ${ColorStep.createColorStep(
          10,
          360,
          "deg"
        )})`,
      };
    });
  },
};
