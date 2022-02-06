import { SVGGradient } from "./SVGGradient";
import { Length } from "el/editor/unit/Length";
import { FuncType, GradientType, SpreadMethodType } from "el/editor/types/model";
import { parseOneValue } from "el/utils/css-function-parser";

const SpreadMethodList = [SpreadMethodType.PAD, SpreadMethodType.REFLECT, SpreadMethodType.REPEAT];
export class SVGLinearGradient extends SVGGradient {

  convert(json) {

    json.spreadMethod = SpreadMethodList.includes(json.spreadMethod) ? json.spreadMethod : SpreadMethodType.PAD;

    return json;
  }

  getDefaultObject(obj) {
    return super.getDefaultObject({
      type: GradientType.LINEAR,
      x1: Length.parse("50%"),
      y1: Length.parse("50%"),
      x2: Length.parse("100%"),
      y2: Length.parse("50%"),
      spreadMethod: SpreadMethodType.PAD,
      ...obj
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs('x1', 'y1', 'x2', 'y2', 'spreadMethod')
    }
  }

  toString() {
    if (this.colorsteps.length === 0) return '';

    var colorString = this.getColorString();

    var { x1, y1, x2, y2, spreadMethod } = this.json;
    var opt = [x1, y1, x2, y2, spreadMethod].join(' ');

    var result = `${this.json.type}(${opt}, ${colorString})`;

    return result;
  }

  toSVGString(id) {
    var { x1, y1, x2, y2, spreadMethod } = this.json;

    return /*html*/`
      <linearGradient 
        id="${id}"
        x1="${x1}"
        x2="${x2}"
        y1="${y1}"
        y2="${y2}"
        spreadMethod="${spreadMethod}"
      >
        ${SVGLinearGradient.makeColorStepList(this.colorsteps).map(it => /*html*/`
        <stop offset="${it.percent}%" stop-color="${it.color}"/>
      `).join('')}
      </linearGradient>
    `
  }

  toFillValue(id) {
    return `url(#${id})`;
  }

  // static toLinearGradient(colorsteps) {
  //   if (colorsteps.length === 0) {
  //     return "none";
  //   }

  //   var gradient = new LinearGradient({
  //     angle: "to right",
  //     colorsteps
  //   });

  //   return gradient + "";
  // }

  static parse(str) {

    const result = parseOneValue(str);

    var opt = {}

    const [options, ...colors] = result.parsedParameters;
    const list = []

    // option parser 
    options.forEach(it => {

      if (it.func === FuncType.KEYWORD) {
        if (SpreadMethodList.includes(it.matchedString)) {
          opt.spreadMethod = it.matchedString;
        }
      } else {
        list.push(it);
      }
    });

    var [
      x1 = Length.percent(50), 
      y1 = Length.percent(50), 
      x2 = Length.percent(100), 
      y2 = Length.percent(50), 
    ] = list.map(it => it.parsed);

    opt = {
      ...opt,
      x1,
      y1,
      x2,
      y2,
    }

    // colorstep parser 
    const colorsteps = SVGLinearGradient.parseColorSteps(colors)

    return new SVGLinearGradient({ ...opt, colorsteps });
  }
}
