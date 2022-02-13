import { Gradient } from "./Gradient";

import { Length, Position } from "el/editor/unit/Length";
import { FuncType, RadialGradientSizeType, RadialGradientType } from "el/editor/types/model";
import { vec3 } from "gl-matrix";
import { isArray } from "el/sapa/functions/func";
import { rectToVerties } from "el/utils/collision";
import { parseOneValue } from "el/utils/css-function-parser";

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
      radialSize: RadialGradientSizeType.FARTHEST_CORNER,
      radialPosition: [Position.CENTER, Position.CENTER],
      ...obj
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs(
        'radialType',
        'radialSize',
        'radialPosition'
      )
    }
  }

  isRadial() {
    return true;
  }

  getConerDist(result) {
    // coner 관련 
    let topLeftPoint = result.backVerties[0]
    let topRightPoint = result.backVerties[1]
    let bottomLeftPoint = result.backVerties[3]
    let bottomRightPoint = result.backVerties[2]

    const topLeftDist = vec3.dist(result.radialCenterPosition, topLeftPoint);
    const topRightDist = vec3.dist(result.radialCenterPosition, topRightPoint);
    const bottomLeftDist = vec3.dist(result.radialCenterPosition, bottomLeftPoint);
    const bottomRightDist = vec3.dist(result.radialCenterPosition, bottomRightPoint);

    const cornerList = [
      ['top-left', topLeftPoint, topLeftDist],
      ['top-right', topRightPoint, topRightDist],
      ['bottom-left', bottomLeftPoint, bottomLeftDist],
      ['bottom-right', bottomRightPoint, bottomRightDist]
    ]

    cornerList.sort((a, b) => {
      return a[2] - b[2];
    });

    return {
      cornerList,
      topLeftDist,
      topRightDist,
      bottomLeftDist,
      bottomRightDist
    };
  }

  EllipseRadiusToSide(result, isClosest = true) {
    var dx1 = Math.abs(result.radialCenterPoint[0]);
    var dy1 = Math.abs(result.radialCenterPoint[1]);
    var dx2 = Math.abs(result.radialCenterPoint[0] - result.backRect.width);
    var dy2 = Math.abs(result.radialCenterPoint[1] - result.backRect.height);

    if (isClosest) {
      var dx = dx1 < dx2 ? dx1 : dx2;
      var dy = dy1 < dy2 ? dy1 : dy2;

    } else {
      var dx = dx1 > dx2 ? dx1 : dx2;
      var dy = dy1 > dy2 ? dy1 : dy2;

    }

    return { width: dx, height: dy };
  }

  EllipseRadius(newSize, result, isClosest = true) {

    const { cornerList, topLeftDist, topRightDist, bottomRightDist, bottomLeftDist } = this.getConerDist(result);

    const targetList = [topLeftDist, topRightDist, bottomLeftDist, bottomRightDist];

    var raySize = isClosest ? Math.min(...targetList) :  Math.max(...targetList);
    var point = cornerList.find(it => it[2] === raySize)[1];

    var aspect_ratio = newSize.width / newSize.height;

    if (aspect_ratio === 0) {
      // 비율이 안 맞을 때는 처리를 해줘야함 
      return;
    }

    var distPoint = vec3.subtract([], point, result.radialCenterPosition);

    // x^2/a^2 + y^2/b^2 = 1
    // a/b = aspectRatio, b = a/aspectRatio
    // a = sqrt(x^2 + y^2/(1/aspect_ratio^2))

    var a = Math.sqrt(
      Math.pow(distPoint[0], 2) +
      Math.pow(distPoint[1], 2) * Math.pow(aspect_ratio, 2)
    );
    var b = a / aspect_ratio;

    return { width: a, height: b };
  }

  getStartEndPoint(result) {

    let startPoint, endPoint, shapePoint

    const radialType = this.json.radialType;
    const radialSize = this.json.radialSize;
    let [rx, ry] = this.json.radialPosition;

    const backRect = result.backRect;
    const backVerties = rectToVerties(backRect.x, backRect.y, backRect.width, backRect.height);

    if (rx == 'center') rx = Length.percent(50);
    if (ry == 'center') ry = Length.percent(50);

    const newRx = rx.toPx(backRect.width);
    const newRy = ry.toPx(backRect.height);

    const centerPoisiton = [backRect.x + newRx.value, backRect.y + newRy.value, 0];

    // side 관련 
    let leftPoint = [backVerties[0][0], newRy.value, 0]
    let rightPoint = [backVerties[1][0], newRy.value, 0]
    let topPoint = [newRx.value, backVerties[0][1], 0]
    let bottomPoint = [newRx.value, backVerties[3][1], 0]

    const leftDist = vec3.dist(centerPoisiton, leftPoint);
    const rightDist = vec3.dist(centerPoisiton, rightPoint);
    const topDist = vec3.dist(centerPoisiton, topPoint);
    const bottomDist = vec3.dist(centerPoisiton, bottomPoint);

    const list = [
      ['top', topPoint, topDist],
      ['left', leftPoint, leftDist],
      ['right', rightPoint, rightDist],
      ['bottom', bottomPoint, bottomDist]
    ]

    list.sort((a, b) => {
      return a[2] - b[2];
    });

    // coner 관련 
    let topLeftPoint = backVerties[0]
    let topRightPoint = backVerties[1]
    let bottomLeftPoint = backVerties[3]
    let bottomRightPoint = backVerties[2]

    const topLeftDist = vec3.dist(centerPoisiton, topLeftPoint);
    const topRightDist = vec3.dist(centerPoisiton, topRightPoint);
    const bottomLeftDist = vec3.dist(centerPoisiton, bottomLeftPoint);
    const bottomRightDist = vec3.dist(centerPoisiton, bottomRightPoint);

    const cornerList = [
      ['top-left', topLeftPoint, topLeftDist],
      ['top-right', topRightPoint, topRightDist],
      ['bottom-left', bottomLeftPoint, bottomLeftDist],
      ['bottom-right', bottomRightPoint, bottomRightDist]
    ]

    cornerList.sort((a, b) => {
      return a[2] - b[2];
    });


    startPoint = vec3.clone(centerPoisiton);

    switch (radialType) {
      case RadialGradientType.CIRCLE:

        switch (radialSize) {
          case RadialGradientSizeType.CLOSEST_SIDE:
            var [side, point, dist] = list[0];
            endPoint = vec3.fromValues(startPoint[0] + dist, startPoint[1], startPoint[2])
            shapePoint = vec3.fromValues(startPoint[0], startPoint[1] + dist, startPoint[2])
            break;

          case RadialGradientSizeType.CLOSEST_CORNER:
            var [side, point, dist] = cornerList[0];

            endPoint = vec3.fromValues(startPoint[0] + dist, startPoint[1], startPoint[2])
            shapePoint = vec3.fromValues(startPoint[0], startPoint[1] + dist, startPoint[2])            
            break;
          case RadialGradientSizeType.FARTHEST_SIDE:
            var [side, point, dist] = list[list.length - 1];
            endPoint = vec3.fromValues(startPoint[0] + dist, startPoint[1], startPoint[2])
            shapePoint = vec3.fromValues(startPoint[0], startPoint[1] + dist, startPoint[2])            
            break;
          case RadialGradientType.CIRCLE:
          case RadialGradientSizeType.FARTHEST_CORNER:
            var [side, point, dist] = cornerList[cornerList.length - 1];
            endPoint = vec3.fromValues(startPoint[0] + dist, startPoint[1], startPoint[2])
            shapePoint = vec3.fromValues(startPoint[0], startPoint[1] + dist, startPoint[2])
            break;
          default:
            // rect 길이에 대비해서 실제 길이를 계산함 
            var dist = (radialSize[0] || radialSize).toPx(vec3.dist(result.backVerties[1], result.backVerties[0])).value;      
            endPoint = vec3.fromValues(startPoint[0] + dist, startPoint[1], startPoint[2])
            shapePoint = vec3.fromValues(startPoint[0], startPoint[1] + dist, startPoint[2])
            break;

        }

        break;

      case RadialGradientType.ELLIPSE:

        switch (radialSize) {
          case RadialGradientSizeType.CLOSEST_SIDE:
            var newSize = this.EllipseRadiusToSide(result, true);

            endPoint = vec3.fromValues(startPoint[0] + newSize.width, startPoint[1], startPoint[2])
            shapePoint = vec3.fromValues(startPoint[0], startPoint[1] + newSize.height, startPoint[2]);

            break;
          case RadialGradientSizeType.CLOSEST_CORNER:
            var newSize = this.EllipseRadiusToSide(result, true);
            var radius = this.EllipseRadius(newSize, result, true);

            endPoint = vec3.fromValues(startPoint[0] + radius.width, startPoint[1], startPoint[2])
            shapePoint = vec3.fromValues(startPoint[0], startPoint[1] + radius.height, startPoint[2]);
            break;
          case RadialGradientSizeType.FARTHEST_SIDE:
            var newSize = this.EllipseRadiusToSide(result, false);

            endPoint = vec3.fromValues(startPoint[0] + newSize.width, startPoint[1], startPoint[2])
            shapePoint = vec3.fromValues(startPoint[0], startPoint[1] + newSize.height, startPoint[2]);

            break;

          case RadialGradientSizeType.FARTHEST_CORNER:
            var newSize = this.EllipseRadiusToSide(result, false);
            var radius = this.EllipseRadius(newSize, result, false);

            endPoint = vec3.fromValues(startPoint[0] + radius.width, startPoint[1], startPoint[2])
            shapePoint = vec3.fromValues(startPoint[0], startPoint[1] + radius.height, startPoint[2]);
            break;
          default:
            var raySize = radialSize[0].toPx(vec3.dist(result.backVerties[1], result.backVerties[0])).value;
            var shapeSize = radialSize[1].toPx(vec3.dist(result.backVerties[3], result.backVerties[0])).value;

            endPoint = vec3.fromValues(startPoint[0] + raySize, startPoint[1], startPoint[2])
            shapePoint = vec3.fromValues(startPoint[0], startPoint[1] + shapeSize, startPoint[2]);
            break;
        }

        break;

    }

    return {
      startPoint, endPoint, shapePoint
    }
  }



  toString() {
    if (this.colorsteps.length === 0) return '';
    var colorString = this.getColorString();
    var json = this.json;
    var opt = '';
    var radialType = json.radialType || RadialGradientType.ELLIPSE;
    var radialSize = json.radialSize || RadialGradientSizeType.FARTHEST_CORNER;
    var radialPosition = json.radialPosition || ["center", "center"];

    radialPosition = DEFINED_POSITIONS[radialPosition]
      ? radialPosition
      : radialPosition.join(' ');

    radialSize = isArray(radialSize) ? radialSize.join(" ") : radialSize;

    opt = radialPosition ? `${radialType} ${radialSize} at ${radialPosition}` : `${radialType} ${radialSize}`;

    return `${json.type || "radial-gradient"}(${opt}, ${colorString})`;
  }


  toCSSString() {
    if (this.colorsteps.length === 0) return '';

    var colorString = RadialGradient.toCSSColorString(this.colorsteps);
    var json = this.json;
    var opt = '';
    var radialType = json.radialType || RadialGradientType.ELLIPSE;
    var radialSize = json.radialSize || RadialGradientSizeType.FARTHEST_CORNER;
    var radialPosition = json.radialPosition || ["center", "center"];

    radialPosition = DEFINED_POSITIONS[radialPosition]
      ? radialPosition
      : radialPosition.join(' ');

    radialSize = isArray(radialSize) ? radialSize.join(" ") : radialSize;

    opt = radialPosition ? `${radialType} ${radialSize} at ${radialPosition}` : `${radialType} ${radialSize}`;

    return `${json.type || "radial-gradient"}(${opt}, ${colorString})`;
  }

  static parse(str) {

    const result = parseOneValue(str);
    var opt = {
      radialType: RadialGradientType.ELLIPSE,
      radialSize: RadialGradientSizeType.FARTHEST_CORNER,
      radialPosition: ["center", "center"]
    }

   
    let [options, ...colors] = result.parameters;

    // 최초 옵션이 있는 경우, 
    // 컬러부터 시작하지 않으면 옵션이 있는 것으로 간주 
    if (options[0].func !== FuncType.COLOR) {

      let radialType = RadialGradientType.ELLIPSE;
      let hasAt = false;
      let positions = [];
      let sizeOption = [];
      options.forEach(it => {
        if (it.func === FuncType.KEYWORD && it.matchedString === 'at') {
          hasAt = true;
        } else if (hasAt) { // at 이 설정된 이후는 position 으로 파싱 
          positions.push(it);
        } else {
          switch(it.matchedString) {
          // radial shape 
          case RadialGradientType.CIRCLE:
          case RadialGradientType.ELLIPSE:
            radialType = it.matchedString;
            break;
          default:
            sizeOption.push(it);
            break;
          }
        }
      })

      opt.radialType = radialType;
      opt.radialPosition = positions.map(it => {
        if (it.func === FuncType.KEYWORD) {
          switch(it.matchedString) {
          case 'top': return Length.percent(0);
          case 'left': return Length.percent(0);
          case 'right': return Length.percent(100);
          case 'bottom': return Length.percent(100);
          case 'center': return Length.percent(50);
          }
        }
        return it.parsed
      });
      opt.radialSize = sizeOption.map(it => {
        if (it.func === FuncType.KEYWORD) return it.matchedString;
        return it.parsed
      });

      if (opt.radialSize.length === 1) {
        opt.radialSize = opt.radialSize[0];
      }

    } else {
      colors = result.parameters;
    } 


    const colorsteps = RadialGradient.parseColorSteps(colors)

    return new RadialGradient({ ...opt, colorsteps });
  }
}
