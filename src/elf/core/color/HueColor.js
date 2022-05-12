import { mix } from "./mixin";
import { parse } from "./parser";

export const hue_color = [
  { rgb: "#ff0000", start: 0.0 },
  { rgb: "#ffff00", start: 0.17 },
  { rgb: "#00ff00", start: 0.33 },
  { rgb: "#00ffff", start: 0.5 },
  { rgb: "#0000ff", start: 0.67 },
  { rgb: "#ff00ff", start: 0.83 },
  { rgb: "#ff0000", start: 1 },
];

export function checkHueColor(p) {
  var startColor, endColor;

  for (var i = 0; i < hue_color.length; i++) {
    if (hue_color[i].start >= p) {
      startColor = hue_color[i - 1];
      endColor = hue_color[i];
      break;
    }
  }

  if (startColor && endColor) {
    return mix(
      startColor,
      endColor,
      (p - startColor.start) / (endColor.start - startColor.start)
    );
  }

  return hue_color[0].rgb;
}

function initHueColors() {
  for (var i = 0, len = hue_color.length; i < len; i++) {
    var hue = hue_color[i];

    var obj = parse(hue.rgb);

    hue.r = obj.r;
    hue.g = obj.g;
    hue.b = obj.b;
  }
}

initHueColors();
