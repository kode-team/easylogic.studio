import { OBJECT_TO_PROPERTY } from "../../util/functions/func";
import { convertMatches, reverseMatches } from "../../util/functions/parser";
import { ColorStep } from "./ColorStep";
import { SVGGradient } from "./SVGGradient";
import { Length } from "../unit/Length";

export class SVGLinearGradient extends SVGGradient {
  getDefaultObject(obj) {
    return super.getDefaultObject({
      type: "linear-gradient",
      x1: '0%',
      y1: '0%',
      x2: '100%',      
      y2: '0%',
      spreadMethod: 'pad',
      ...obj
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      x1: this.json.x1,
      y1: this.json.y1,
      x2: this.json.x2,
      y2: this.json.y2,
      spreadMethod: this.json.spreadMethod
    }
  }

  toString() {

    // linear-gradient(x1 y1 x2 y2 spreadMethod, ....colors)

    if(this.colorsteps.length === 0) return '';    

    var colorString = this.getColorString();

    var {x1, y1, x2, y2, spreadMethod} = this.json;
    var opt = [x1, y1, x2, y2, spreadMethod].join(' ');

    var result = `${this.json.type}(${opt}, ${colorString})`;

    return result;
  }

  toSVGString(id) {
      var {x1, y1, x2, y2, spreadMethod} = this.json;    

      return /*html*/`
<linearGradient ${OBJECT_TO_PROPERTY({ id, x1, x2, y1, y2, spreadMethod })} >
  ${this.colorsteps.map(it => {
    return /*html*/`<stop offset="${it.percent}%"  stop-color="${it.color}" ></stop>`
  }).join('\n')}
</linearGradient>
      `
  }

  toFillValue (id) {
      return `url(#${id})`;
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
    var opt = {};
    var colorsteps = [];
    results.str
      .split("(")[1]
      .split(")")[0]
      .split(",")
      .map(it => it.trim())
      .forEach((newValue, index) => {
        if (newValue.includes("@")) {

          newValue = reverseMatches(newValue, results.matches);

          colorsteps.push(...ColorStep.parse(newValue));
        } else {

          var [x1, y1, x2, y2, spreadMethod] = newValue.split(' ')

          opt.x1 = Length.parse(x1);
          opt.y1 = Length.parse(y1);
          opt.x2 = Length.parse(x2);
          opt.y2 = Length.parse(y2);
          opt.spreadMethod = spreadMethod || 'pad'
        }
      });

    return new SVGLinearGradient({ ...opt, colorsteps });
  }
}
