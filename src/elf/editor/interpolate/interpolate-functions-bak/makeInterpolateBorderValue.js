import { makeInterpolateBoolean } from "./makeInterpolateBoolean";
import { makeInterpolateColor } from "./makeInterpolateColor";
import { makeInterpolateLength } from "./makeInterpolateLength";

import { Border } from "elf/editor/property-parser/Border";

export function makeInterpolateBorderValue(
  layer,
  property,
  startValue,
  endValue
) {
  var s = Border.parseValue(startValue);
  var e = Border.parseValue(endValue);

  var results = {
    width: makeInterpolateLength(layer, property, s.width, e.width, "border"),
    style: makeInterpolateBoolean(layer, property, s.style, e.style),
    color: makeInterpolateColor(layer, property, s.color, e.color),
  };

  return (rate, t) => {
    return Border.joinValue({
      width: results.width(rate, t),
      style: results.style(rate, t),
      color: results.color(rate, t),
    });
  };
}
