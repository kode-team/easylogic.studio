import { makeInterpolateColorStepList } from "./makeInterpolateColorStepList";
import { makeInterpolateString } from "../makeInterpolateString";
import { makeInterpolateLength } from "../makeInterpolateLength";
import { RadialGradient } from "elf/editor/property-parser/image-resource/RadialGradient";

function convertPercent(value, type) {
  switch (type) {
    case "width":
      if (value === "center") {
        return "50%";
      } else if (value === "left") {
        return "0%";
      } else if (value === "right") {
        return "100%";
      }
      break;
    case "height":
      if (value === "center") {
        return "50%";
      } else if (value === "top") {
        return "0%";
      } else if (value === "bottom") {
        return "100%";
      }
      break;
  }

  return value;
}

export function makeInterpolateRadialGradient(layer, property, s, e) {
  // angle 이랑
  // colorsteps

  // console.log(s, e);

  s.radialPosition[0] = convertPercent(s.radialPosition[0], "width");
  s.radialPosition[1] = convertPercent(s.radialPosition[1], "height");

  e.radialPosition[0] = convertPercent(e.radialPosition[0], "width");
  e.radialPosition[1] = convertPercent(e.radialPosition[1], "height");

  var obj = {
    radialType: makeInterpolateString(
      layer,
      property,
      s.radialType,
      e.radialType
    ),
    radialPositionX: makeInterpolateLength(
      layer,
      property,
      s.radialPosition[0],
      e.radialPosition[0],
      "width",
      "self"
    ),
    radialPositionY: makeInterpolateLength(
      layer,
      property,
      s.radialPosition[1],
      e.radialPosition[1],
      "height",
      "self"
    ),
    colorsteps: makeInterpolateColorStepList(
      layer,
      property,
      s.colorsteps,
      e.colorsteps
    ),
  };

  return (rate, t) => {
    var results = new RadialGradient({
      radialType: obj.radialType(rate, t),
      radialPosition: [
        obj.radialPositionX(rate, t),
        obj.radialPositionY(rate, t),
      ],
      colorsteps: obj.colorsteps(rate, t),
    });

    return results;
  };
}
