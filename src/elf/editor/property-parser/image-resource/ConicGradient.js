import { vec3 } from "gl-matrix";

import { clone, isNotUndefined } from "sapa";

import { Gradient } from "./Gradient";

import { rectToVerties } from "elf/core/collision";
import { FuncType } from "elf/editor/types/model";
import { Length, Position } from "elf/editor/unit/Length";
import { parseOneValue } from "elf/utils/css-function-parser";

const DEFINED_POSITIONS = {
  ["center"]: true,
  ["top"]: true,
  ["left"]: true,
  ["right"]: true,
  ["bottom"]: true,
};

const DEFINED_ANGLES = {
  "to top": 0,
  "to top right": 45,
  "to right": 90,
  "to bottom right": 135,
  "to bottom": 180,
  "to bottom left": 225,
  "to left": 270,
  "to top left": 315,
};

export class ConicGradient extends Gradient {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      type: "conic-gradient",
      angle: 0,
      radialPosition: [Position.CENTER, Position.CENTER],
      ...obj,
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      angle: this.json.angle,
      radialPosition: clone(this.json.radialPosition),
    };
  }

  hasAngle() {
    return true;
  }

  pickColorStep(percent) {
    // conic 의 경우 percent 가 마이너스로 올수 없으니 절대값으로 변환한다.
    return super.pickColorStep((percent + 100) % 100);
  }

  getStartEndPoint(result) {
    let startPoint, endPoint, shapePoint;

    let [rx, ry] = this.json.radialPosition;

    const backRect = result.backRect;
    const backVerties = rectToVerties(
      backRect.x,
      backRect.y,
      backRect.width,
      backRect.height
    );

    if (rx == "center") rx = Length.percent(50);
    if (ry == "center") ry = Length.percent(50);

    const newRx = rx.toPx(backRect.width);
    const newRy = ry.toPx(backRect.height);

    const centerPoisiton = [
      backRect.x + newRx.value,
      backRect.y + newRy.value,
      0,
    ];

    // coner 관련
    let topLeftPoint = backVerties[0];
    let topRightPoint = backVerties[1];
    let bottomLeftPoint = backVerties[3];
    let bottomRightPoint = backVerties[2];

    const topLeftDist = vec3.dist(centerPoisiton, topLeftPoint);
    const topRightDist = vec3.dist(centerPoisiton, topRightPoint);
    const bottomLeftDist = vec3.dist(centerPoisiton, bottomLeftPoint);
    const bottomRightDist = vec3.dist(centerPoisiton, bottomRightPoint);

    startPoint = vec3.clone(centerPoisiton);

    const dist = Math.max(
      topLeftDist,
      topRightDist,
      bottomLeftDist,
      bottomRightDist
    );
    endPoint = vec3.fromValues(
      startPoint[0] + dist,
      startPoint[1],
      startPoint[2]
    );
    shapePoint = vec3.fromValues(
      startPoint[0],
      startPoint[1] - dist,
      startPoint[2]
    );

    return {
      startPoint,
      endPoint,
      shapePoint,
    };
  }

  toString() {
    var colorString = this.getColorString();

    var opt = [];
    var json = this.json;

    var conicAngle = json.angle;
    var conicPosition = json.radialPosition || Position.CENTER;

    conicPosition = DEFINED_POSITIONS[conicPosition]
      ? conicPosition
      : conicPosition.join(" ");

    if (isNotUndefined(conicAngle)) {
      conicAngle = +(DEFINED_ANGLES[conicAngle] || conicAngle);
      opt.push(`from ${conicAngle}deg`);
    }

    if (conicPosition) {
      opt.push(`at ${conicPosition}`);
    }

    var optString = opt.length ? opt.join(" ") + "," : "";

    return `${json.type}(${optString} ${colorString})`;
  }

  toCSSString() {
    if (this.colorsteps.length === 0) return "";

    var colorString = ConicGradient.toCSSColorString(
      this.colorsteps,
      "deg",
      360
    );

    var opt = [];
    var json = this.json;

    var conicAngle = json.angle;
    var conicPosition = json.radialPosition || Position.CENTER;

    conicPosition = DEFINED_POSITIONS[conicPosition]
      ? conicPosition
      : conicPosition.join(" ");

    if (isNotUndefined(conicAngle)) {
      conicAngle = +(DEFINED_ANGLES[conicAngle] || conicAngle);
      opt.push(`from ${conicAngle}deg`);
    }

    if (conicPosition) {
      opt.push(`at ${conicPosition}`);
    }

    var optString = opt.length ? opt.join(" ") + "," : "";

    return `${json.type}(${optString} ${colorString})`;
  }

  static parse(str) {
    const result = parseOneValue(str);
    var opt = {
      angle: 0,
      radialPosition: ["center", "center"],
    };

    let [options, ...colors] = result.parameters;

    // 최초 옵션이 있는 경우,
    // 컬러부터 시작하지 않으면 옵션이 있는 것으로 간주
    if (options[0].func !== FuncType.COLOR) {
      let hasFrom = false;
      let hasAt = false;
      let positions = [];
      let angle = [];
      options.forEach((it) => {
        if (it.func === FuncType.KEYWORD && it.matchedString === "from") {
          hasFrom = true;
        } else if (it.func === FuncType.KEYWORD && it.matchedString === "at") {
          hasAt = true;
        } else if (hasAt) {
          // at 이 설정된 이후는 position 으로 파싱
          positions.push(it);
        } else if (hasFrom) {
          angle.push(it);
        }
      });

      opt.radialPosition = positions.map((it) => {
        if (it.func === FuncType.KEYWORD) {
          switch (it.matchedString) {
            case "top":
              return Length.percent(0);
            case "left":
              return Length.percent(0);
            case "right":
              return Length.percent(100);
            case "bottom":
              return Length.percent(100);
            case "center":
              return Length.percent(50);
          }
        }
        return it.parsed;
      });

      if (angle.length) {
        opt.angle = angle[0].parsed.value;
      }
    } else {
      colors = result.parameters;
    }

    const colorsteps = ConicGradient.parseColorSteps(colors);

    return new ConicGradient({ ...opt, colorsteps });
  }
}
