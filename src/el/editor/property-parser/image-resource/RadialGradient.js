import { Gradient } from "./Gradient";

import { Length, Position } from "el/editor/unit/Length";
import { convertMatches, reverseMatches } from "el/utils/parser";
import { ColorStep } from "./ColorStep";

const DEFINED_POSITIONS = {
  ["center"]: true,
  ["top"]: true,
  ["left"]: true,
  ["right"]: true,
  ["bottom"]: true
};

export class RadialGradient extends Gradient {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      type: "radial-gradient",
      radialType: "ellipse",
      radialPosition: [Position.CENTER, Position.CENTER],
      ...obj
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs(
        'radialType',
        'radialPosition'
      )
    }
  }

  isRadial() {
    return true;
  }

  toString() {
    if(this.colorsteps.length === 0) return '';        
    var colorString = this.getColorString();
    var json = this.json;
    var opt = '';
    var radialType = json.radialType || 'circle';
    var radialPosition = json.radialPosition || ["center", "center"];

    radialPosition = DEFINED_POSITIONS[radialPosition]
      ? radialPosition
      : radialPosition.join(' ');

    opt = radialPosition ? `${radialType} at ${radialPosition}` : radialType;

    return `${json.type || "radial-gradient"}(${opt}, ${colorString})`;
  }

  static parse(str) {
    var results = convertMatches(str);
    var radialType = "ellipse";
    var radialPosition = [Position.CENTER, Position.CENTER];
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

          colorsteps.push.apply(colorsteps, ColorStep.parse(newValue));
        } else {
          // direction
          if (newValue.includes("at")) {
            [radialType, radialPosition] = newValue.split("at").map(it => it.trim());
          } else {
            radialType = newValue;
          }

          if (typeof radialPosition === 'string') {
            var arr = radialPosition.split(' ');
            if (arr.length === 1) {
              var len = Length.parse(arr[0]);

              if (len.isString()) {
                radialPosition = [len.value, len.value];
              } else {
                radialPosition = [len.clone(), len.clone()];
              }
            } else if (arr.length === 2) {
              radialPosition = arr.map(it => {
                var len = Length.parse(it);
                return len.isString() ? len.value : len.clone();
              });
            }
          }
        }
      });

    return new RadialGradient({ radialType, radialPosition, colorsteps });
  }
}
