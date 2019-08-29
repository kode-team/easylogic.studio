import { Gradient } from "./Gradient";
import { isNumber, isUndefined } from "../../util/functions/func";
import { convertMatches, reverseMatches } from "../../util/functions/parser";
import { Length } from "../unit/Length";
import { ColorStep } from "./ColorStep";

const DEFINED_DIRECTIONS = {
  "0": "to top",
  "45": "to top right",
  "90": "to right",
  "135": "to bottom right",
  "180": "to bottom",
  "225": "to bottom left",
  "270": "to left",
  "315": "to top left"
};

const DEFINED_ANGLES = {
  "to top": "0",
  "to top right": "45",
  "to right": "90",
  "to bottom right": "135",
  "to bottom": "180",
  "to bottom left": "225",
  "to left": "270",
  "to top left": "315"
};

export class LinearGradient extends Gradient {
  getDefaultObject(obj) {
    return super.getDefaultObject({
      type: "linear-gradient",
      angle: 0,
      ...obj
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      angle: this.json.angle
    }
  }

  isLinear() {
    return true;
  }
  hasAngle() {
    return true;
  }

  toString() {

    if(this.colorsteps.length === 0) return '';    

    var colorString = this.getColorString();

    var opt = '';
    var angle = this.json.angle || 0;

    opt = angle;

    if (isNumber(opt)) {
      opt = DEFINED_DIRECTIONS[`${opt}`] || opt;
    }

    if (isNumber(opt)) {
      opt = opt > 360 ? opt % 360 : opt;

      opt = `${opt}deg`;
    }


    var result = `${this.json.type}(${opt}, ${colorString})`;

    return result;
  }

  static toLinearGradient(colorsteps) {
    if (colorsteps.length === 0) {
      return "none";
    }

    var gradient = new LinearGradient({
      angle: "to right",
      colorsteps
    });

    return gradient + "";
  }

  static parse(str) {
    var results = convertMatches(str);
    var angle = 0;
    var colorsteps = [];
    results.str
      .split("(")[1]
      .split(")")[0]
      .split(",")
      .map(it => it.trim())
      .forEach((newValue, index) => {
        if (newValue.includes("@")) {
          // color 복원
          newValue = reverseMatches(newValue, results.matches);

          // 나머지는 ColorStep 이 파싱하는걸로
          // ColorStep 은 파싱이후 colorsteps 를 리턴해줌... 배열임, 명심 명심
          colorsteps.push(...ColorStep.parse(newValue));
        } else {
          // direction
          angle = isUndefined(DEFINED_ANGLES[newValue])
            ? Length.parse(newValue)
            : Length.deg(+DEFINED_ANGLES[newValue]);
        }
      });

    return new LinearGradient({ angle: angle.value, colorsteps });
  }
}
