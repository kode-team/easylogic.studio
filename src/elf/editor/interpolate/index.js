import { createBezierForPattern } from "elf/utils/bezier";
import timingFunctions from "./timing-functions";

export function createTimingFunction(timing = "linear") {
  var [funcName] = timing.split("(").map((it) => it.trim());

  var func = timingFunctions[funcName];

  if (func) {
    var args = timing
      .split("(")[1]
      .split(")")[0]
      .split(",")
      .map((it) => it.trim());
    return func(...args);
  } else {
    return createCurveFunction(timing);
  }
}

export function createCurveFunction(timing) {
  var func = createBezierForPattern(timing);
  return (rate) => {
    return func(rate).y;
  };
}
