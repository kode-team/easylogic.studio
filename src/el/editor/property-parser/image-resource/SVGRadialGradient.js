import { SVGGradient } from "./SVGGradient";
import { OBJECT_TO_PROPERTY } from "el/utils/func";
import { Length } from "el/editor/unit/Length";
import { calculateAngle360, degreeToRadian } from "el/utils/math";
import { mat3, vec3 } from "gl-matrix";
import { FuncType, GradientType, RadialGradientType, SpreadMethodType } from "el/editor/types/model";
import { parseOneValue } from "el/utils/css-function-parser";

const RadialTypeList = [RadialGradientType.CIRCLE, RadialGradientType.ELLIPSE];
const SpreadMethodList = [SpreadMethodType.PAD, SpreadMethodType.REFLECT, SpreadMethodType.REPEAT];

export class SVGRadialGradient extends SVGGradient {

  convert(json) {

    json.spreadMethod = SpreadMethodList.includes(json.spreadMethod) ? json.spreadMethod : SpreadMethodType.PAD;

    return json;
  }

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      type: GradientType.RADIAL,
      radialType: RadialGradientType.CIRCLE,
      x1: Length.parse("50%"),
      y1: Length.parse("50%"),
      x2: Length.parse("100%"),
      y2: Length.parse("50%"),
      x3: Length.parse("50%"),
      y3: Length.parse("100%"),
      spreadMethod: SpreadMethodType.PAD,
      ...obj
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs('radialType', 'x1', 'y1', 'x2', 'y2', 'x3', 'y3', 'spreadMethod')

    }
  }


  toString() {

    if (this.colorsteps.length === 0) return '';

    var colorString = this.getColorString();

    var { radialType, x1, y1, x2, y2, x3, y3, spreadMethod } = this.json;
    var opt = [radialType, x1, y1, x2, y2, x3, y3, spreadMethod].join(' ').trim();

    var result = `${this.json.type}(${opt}, ${colorString})`;

    // console.log({result});

    return result;
  }

  getGradientAngle(contentBox = {}) {
    var { x1, y1, x2, y2 } = this.json;

    const newX1 = x1.toPx(contentBox.width);
    const newY1 = y1.toPx(contentBox.height);
    const newX2 = x2.toPx(contentBox.width);
    const newY2 = y2.toPx(contentBox.height);

    const angle = calculateAngle360(newX2.value - newX1.value, newY2.value - newY1.value) + 180;

    return angle % 360;
  }



  /**
   * 
   * @param {string} id 
   * @param {ContentBox} contentBox 
   * @returns 
   */
  toSVGString(id, contentBox = {}) {

    var { x1: cx, y1: cy, x2, y2, x3, y3, spreadMethod, radialType } = this.json;

    const newX1 = cx.toPx(contentBox.width);
    const newY1 = cy.toPx(contentBox.height);
    const newX2 = x2.toPx(contentBox.width);
    const newY2 = y2.toPx(contentBox.height);

    const ratio = contentBox.height / contentBox.width;

    var dist = vec3.dist([newX1.value, newY1.value, 0], [newX2.value, newY2.value, 0]);

    var angle = this.getGradientAngle(contentBox);

    const view = mat3.create();

    mat3.multiply(view, view, mat3.fromTranslation([], [newX1.value, newY1.value]));
    mat3.multiply(view, view, mat3.fromRotation([], degreeToRadian(angle)));

    if (radialType === RadialGradientType.ELLIPSE) {
      const newX3 = x3.toPx(contentBox.width);
      const newY3 = y3.toPx(contentBox.height);
      var dist2 = vec3.dist([newX1.value, newY1.value, 0], [newX3.value, newY3.value, 0]);
      mat3.multiply(view, view, mat3.fromScaling([], [1, dist2 / dist]));
    }

    const gradientTransform = `matrix(${view[0]}, ${view[1]}, ${view[3]}, ${view[4]}, ${view[6]}, ${view[7]})`;

    return /*html*/`
<radialGradient ${OBJECT_TO_PROPERTY({ id, cx: 0, cy: 0, r: dist, spreadMethod, gradientUnits: "userSpaceOnUse", gradientTransform })} >
    ${SVGRadialGradient.makeColorStepList(this.colorsteps).map(it => /*html*/`
      <stop offset="${it.percent}%" stop-color="${it.color}"/>
    `).join('')}
</radialGradient>
`
  }

  toFillValue(id) {
    return `url(#${id})`;
  }


  static parse(str) {

    const result = parseOneValue(str);

    var opt = {}

    const [options, ...colors] = result.parsedParameters;
    const list = []

    // option parser 
    options.forEach(it => {

      if (it.func === FuncType.KEYWORD) {
        if (RadialTypeList.includes(it.matchedString)) {
          opt.radialType = it.matchedString;
        } else if (SpreadMethodList.includes(it.matchedString)) {
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
      x3 = Length.percent(50), 
      y3 = Length.percent(100)
    ] = list.map(it => it.parsed);

    opt = {
      ...opt,
      x1,
      y1,
      x2,
      y2,
      x3,
      y3
    }

    // colorstep parser 
    const colorsteps = SVGRadialGradient.parseColorSteps(colors)

    // console.log({colorsteps})

    return new SVGRadialGradient({ ...opt, colorsteps });
  }
}
