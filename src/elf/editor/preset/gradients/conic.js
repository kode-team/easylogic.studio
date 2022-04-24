import { randomNumber } from "elf/utils/create";
import { ColorStep } from "elf/editor/property-parser/image-resource/ColorStep";
import { repeat } from "elf/utils/func";

export default {
  title: "Conic",
  key: "conic",
  execute: function (count = 42) {
    return repeat(count).map(() => {
      var x = randomNumber(45, 55);
      var y = randomNumber(45, 55);
      var angle = randomNumber(0, 360);
      return {
        gradient: `conic-gradient(from ${angle}deg at ${x}% ${y}%, ${ColorStep.createColorStep(
          2,
          360,
          "deg"
        )})`,
      };
    });
  },
};
