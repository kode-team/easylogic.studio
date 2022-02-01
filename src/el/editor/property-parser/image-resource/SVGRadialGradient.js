import { convertMatches, reverseMatches } from "el/utils/parser";
import { ColorStep } from "./ColorStep";
import { SVGGradient } from "./SVGGradient";
import { OBJECT_TO_PROPERTY } from "el/utils/func";
import { Length } from "el/editor/unit/Length";
import { calculateAngle360, calculateMatrix, degreeToRadian } from "el/utils/math";
import { mat3, mat4, vec3 } from "gl-matrix";
import { GradientType, RadialGradientType, SpreadMethodType } from "el/editor/types/model";

export class SVGRadialGradient extends SVGGradient {

  convert(json) {
    json.spreadMethod = [SpreadMethodType.PAD, SpreadMethodType.REFLECT, SpreadMethodType.REPEAT].includes(json.spreadMethod) ? json.spreadMethod : SpreadMethodType.PAD;

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

    if(this.colorsteps.length === 0) return '';    

    var colorString = this.getColorString();

    var {radialType, x1, y1, x2, y2, x3, y3, spreadMethod} = this.json;
    var opt = [radialType, x1, y1, x2, y2, x3, y3, spreadMethod].join(' ').trim();

    var result = `${this.json.type}(${opt}, ${colorString})`;

    return result;
  }

  getGradientAngle(contentBox = {}) {
    var {x1, y1, x2, y2} = this.json;    

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

      var {x1: cx, y1: cy, x2, y2, x3, y3, spreadMethod, radialType} = this.json;    

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
        mat3.multiply(view, view, mat3.fromScaling([], [ 1, dist2/dist ]));
      }

      const gradientTransform = `matrix(${view[0]}, ${view[1]}, ${view[3]}, ${view[4]}, ${view[6]}, ${view[7]})`;

      return /*html*/`
<radialGradient ${OBJECT_TO_PROPERTY({ id, cx: 0, cy: 0, r: dist, spreadMethod, gradientUnits: "userSpaceOnUse", gradientTransform })} >
  ${this.colorsteps.map((it, index) => {

    if (it.cut) {
      const prev = this.colorsteps[index - 1];

      if (prev) {
        return /*html*/`
          <stop offset="${prev.percent}%"  stop-color="${it.color}" ></stop>
          <stop offset="${it.percent}%"  stop-color="${it.color}" ></stop>
        `
      }
    }

    return /*html*/`<stop offset="${it.percent}%"  stop-color="${it.color}" />`
  }).join('\n')}
</radialGradient>
`
  }

  toFillValue (id) {
      return `url(#${id})`;
  }  



  static parse(str) {
    var results = convertMatches(str);
    var opt = {} 
    var colorsteps = [];
    const temp = results.str.split("radial-gradient(")[1];

    var arr = temp.split(')')
    arr.pop();

    // TODO: colorstep 에 timing function을 구현해보자. 

    arr.join(')')
      .split(",")
      .map(it => it.trim())
      .forEach((newValue, index) => {
        if (newValue.includes("@")) {
          // color 복원
          newValue = reverseMatches(newValue, results.matches);

          colorsteps.push.apply(colorsteps, ColorStep.parse(newValue));
        } else {

          var tempArray = newValue.split(' ');        

          var index = tempArray.findIndex(it => [RadialGradientType.CIRCLE, RadialGradientType.ELLIPSE].includes(it));
          opt.radialType = index > -1 ? tempArray[index] : RadialGradientType.CIRCLE;
          tempArray[index] = undefined;

          index = tempArray.findIndex(it => [SpreadMethodType.PAD, SpreadMethodType.REFLECT, SpreadMethodType.REFLECT].includes(it));
          opt.spreadMethod = index > -1 ? tempArray[index] : SpreadMethodType.PAD;
          tempArray[index] = undefined;          

          var [x1, y1, x2, y2, x3, y3] = tempArray.filter(Boolean).filter(it => ['true', 'false'].includes(it) === false);

          opt.x1 = Length.parse(x1 || '50%');
          opt.y1 = Length.parse(y1 || '50%');
          opt.x2 = Length.parse(x2 || '100%');
          opt.y2 = Length.parse(y2 || '50%');
          opt.x3 = Length.parse(x3 || '50%');
          opt.y3 = Length.parse(y3 || '100%');
        }
      });

    return new SVGRadialGradient({ ...opt, colorsteps });
  }
}
