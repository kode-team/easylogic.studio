import { round } from "elf/core/math";

/**
 * step timing function
 *
 * @param {number} step
 * @param {string} direction
 * @param {number} roundNumber
 * @returns
 */
const stepTimingFunction = (step = 1, direction = "end") => {
  var stepDist = 1 / step;

  return function (rate) {
    let pos = 0;

    const offset = round(rate / stepDist, 10000000);
    if (direction == "start") {
      pos = Math.ceil(offset);
    } else if (direction == "end") {
      if (rate === 0) return 0;
      else if (rate === 1) return 1;

      pos = Math.ceil(offset) - 1;
    }

    return Math.min(Math.max(stepDist * pos, 0), 1);
  };
};

export function step(step = 1, direction = "end") {
  return stepTimingFunction(step, direction);
}

export function stepStart() {
  return stepTimingFunction(1, "start");
}

export function stepEnd() {
  return stepTimingFunction(1, "end");
}
