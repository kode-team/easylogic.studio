import { Gradient } from "./Gradient";
import { EMPTY_STRING, WHITE_STRING } from "../../util/css/types";
import { isNotUndefined } from "../../util/functions/func";
import { ColorStep } from "./ColorStep";
import { Length, Position } from "../unit/Length";

const DEFINED_POSITIONS = {
  ["center"]: true,
  ["top"]: true,
  ["left"]: true,
  ["right"]: true,
  ["bottom"]: true
};

const DEFINED_ANGLES = {
  "to top": 0,
  "to top right": 45,
  "to right": 90,
  "to bottom right": 135,
  "to bottom": 180,
  "to bottom left": 225,
  "to left": 270,
  "to top left": 315
};

export class ConicGradient extends Gradient {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      type: "conic-gradient",
      angle: 0,
      radialPosition: [Position.CENTER, Position.CENTER],
      ...obj
    });
  }

  isConic() {
    return true;
  }
  hasAngle() {
    return true;
  }

  getColorString() {
    var colorsteps = this.colorsteps;
    if (!colorsteps) return EMPTY_STRING;

    colorsteps.sort((a, b) => {
      if (a.percent == b.percent) {
        if (a.index > b.index) return 1;
        if (a.index < b.index) return 0;
        return 0;
      }
      return a.percent > b.percent ? 1 : -1;
    });

    var newColors = colorsteps.map((c, index) => {
      c.prevColorStep = c.cut && index > 0 ? colorsteps[index - 1] : null;
      return c;
    });

    return newColors
      .map(f => {
        var deg = Math.floor(f.percent * 3.6);
        var prev = EMPTY_STRING;

        if (f.cut && f.prevColorStep) {
          var prevDeg = Math.floor(f.prevColorStep.percent * 3.6);
          prev = `${prevDeg}deg`;
        }
        return `${f.color} ${prev} ${deg}deg`;
      })
      .join(",");
  }

  toString() {
    var colorString = this.getColorString();

    var opt = [];
    var json = this.json;

    var conicAngle = json.angle;
    var conicPosition = json.radialPosition || Position.CENTER;

    conicPosition = DEFINED_POSITIONS[conicPosition]
      ? conicPosition
      : conicPosition.join(WHITE_STRING);

    if (isNotUndefined(conicAngle)) {
      conicAngle = +(DEFINED_ANGLES[conicAngle] || conicAngle);
      opt.push(`from ${conicAngle}deg`);
    }

    if (conicPosition) {
      opt.push(`at ${conicPosition}`);
    }

    var optString = opt.length ? opt.join(WHITE_STRING) + "," : EMPTY_STRING;

    return `${json.type}(${optString} ${colorString})`;
  }
}
