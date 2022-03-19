import { Gradient } from "./Gradient";
import { isNumber} from "el/sapa/functions/func";
import { parseOneValue } from "el/utils/css-function-parser";
import { FuncType } from "el/editor/types/model";

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
  "to top": 0,
  "to top right": 45,
  "to right": 90,
  "to bottom right": 135,
  "to bottom": 180,
  "to bottom left": 225,
  "to left": 270,
  "to top left": 315
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

  getRealAngle () {
    return this.json.angle;
  }

  get angle () {
    return this.getRealAngle();
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

  toCSSString() {

    if(this.colorsteps.length === 0) return '';    

    var colorString = LinearGradient.toCSSColorString(this.colorsteps);

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

  static parse(str) {

    const result = parseOneValue(str);

    var opt = {}

    let [options, ...colors] = result.parameters;
    const list = []
    const keywords = []

    // 최초 옵션이 있는 경우, 
    // 컬러부터 시작하지 않으면 옵션이 있는 것으로 간주 
    if (options[0].func !== FuncType.COLOR) {
      options.forEach(it => {
        if (it.func === FuncType.KEYWORD) {
          keywords.push(it);
        } else {
          list.push(it);
        }
      });
    } else {
      colors = result.parameters;
    }

    let angle = keywords.map(it => it.matchedString).join(' ');

    if (angle === '') {
      [
        angle,
      ] = list.map(it => it.parsed.value);  
    } else {
      angle = DEFINED_ANGLES[angle];
    }

    opt = {
      ...opt,
      angle
    }
    
    const colorsteps = LinearGradient.parseColorSteps(colors)

    return new LinearGradient({ ...opt, colorsteps });
  }
}
