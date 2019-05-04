import { Gradient } from "./Gradient";
import { EMPTY_STRING, WHITE_STRING } from "../../util/css/types";
import { Length, Position } from "../unit/Length";

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

  isRadial() {
    return true;
  }

  toString() {
    var colorString = this.getColorString();
    var json = this.json;
    var opt = EMPTY_STRING;
    var radialType = json.radialType;
    var radialPosition = json.radialPosition || ["center", "center"];

    radialPosition = DEFINED_POSITIONS[radialPosition]
      ? radialPosition
      : radialPosition.join(WHITE_STRING);

    opt = radialPosition ? `${radialType} at ${radialPosition}` : radialType;

    return `${json.type}(${opt}, ${colorString})`;
  }
}
