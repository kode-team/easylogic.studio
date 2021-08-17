import { Length } from "el/editor/unit/Length";
import { PropertyItem } from "el/editor/items/PropertyItem";
import { mat4, vec3 } from "gl-matrix";
import { degreeToRadian } from "el/utils/math";
import { TransformCache } from "./TransformCache";

const TRANSFORM_REG = /((matrix|translate(X|Y|Z|3d)?|scale(X|Y|Z|3d)?|rotate(X|Y|Z|3d)?|skew(X|Y)?|matrix(3d)?|perspective)\(([^\)]*)\))/gi;

export class Transform extends PropertyItem {
  getDefaultObject() {
    return {
      itemType: "transform",
      value: [],
    };
  }

  toCloneObject() {
    return {
      ...this.attrs('itemType', 'type', 'value')
    }
  }

  toString() {
    return `${this.json.type}(${this.json.value.join(', ') || ""})`;
  }


  static join(list) {

    var firstType = 'perspective'
    var lastType = 'matrix3d'

    var arr = list.filter(it => it.type === firstType)
    var last = list.filter(it => it.type === lastType)
    var arr2 = list.filter(it => it.type !== firstType && it.type !== lastType)

    return [...arr, ...arr2, ...last].map(it => new Transform(it).toString()).join(' ')
  }

  hasNumberValue() {
    var type = this.json.type;
    return type.includes('matrix') || type.includes('scale')
  }

  static parse(transform) {
    return new Transform(transform);
  }

  static remove(transform, type = []) {

    if (typeof type === 'string') {
      type = [type]
    }

    return Transform.filter(transform, it => {
      return type.includes(it.type) === false;
    })
  }

  static filter(transform, filterFunction) {
    return Transform.join(Transform.parseStyle(transform, false).filter(it => filterFunction(it)))
  }

  static replace(transform, valueObject) {

    var obj = Transform.parseStyle(transform, false)

    var tObject = obj.find(t => t.type === valueObject.type);

    if (tObject) {
      tObject.value = valueObject.value
    } else {
      obj.push(valueObject)
    }

    return Transform.join(obj);
  }

  static replaceAll(oldTransform, newTransform) {
    var oldT = Transform.parseStyle(oldTransform, false)
    var newT = Transform.parseStyle(newTransform)

    for (var i = 0, len = newT.length; i < len; i++) {
      var newObject = newT[i];
      var oldObject = oldT.find(t => t.type === newObject.type);

      if (oldObject) {
        oldObject.value = newObject.value
      } else {
        oldT.push(newObject)
      }
    }

    return Transform.join(oldT);
  }

  static addTransform(oldTransform, newTransform) {
    var oldT = Transform.parseStyle(oldTransform, false)
    var newT = Transform.parseStyle(newTransform)

    for (var i = 0, len = newT.length; i < len; i++) {
      var newObject = newT[i];
      var oldObject = oldT.find(t => t.type === newObject.type);

      if (oldObject) {
        newObject.value.forEach((v, i) => {
          oldObject.value[i].value += v.value;
        })
      } else {
        oldT.push(newObject)
      }
    }

    return Transform.join(oldT);
  }

  /**
   * 
   * @param {string} transform 
   * @param {string} type 
   * @returns {Length[]} 값 배열 
   */
  static get(transform, type) {
    var arr = Transform.parseStyle(transform, true)

    if (typeof type === 'function') {
      arr = arr.find(type);
    } else {
      arr = arr.find(it => it.type === type);
    }

    if (arr) {
      return arr.value;
    }

    return undefined;
  }

  static createRotateKey(transform, angle, field) {
    return `${transform}:::${field}(${angle})`
  }

  static rotate(transform, angle, field = 'rotate') {

    const key = Transform.createRotateKey(transform, angle, field);

    if (TransformCache.has(key)) return TransformCache.get(key);

    TransformCache.set(key, Transform.replace(transform, { type: field, value: [angle] }));

    return TransformCache.get(key);
  }

  static rotateZ(transform, angle) {
    return Transform.rotate(transform, angle, 'rotateZ')
  }

  static rotateX(transform, angle) {
    return Transform.rotate(transform, angle, 'rotateX')
  }

  static rotateY(transform, angle) {
    return Transform.rotate(transform, angle, 'rotateY')
  }

  /**
   * css transform 문자열을 파싱한다. 
   * 
   * @param {string} transform 
   * @param {boolean} [doCache=true] 캐쉬 적용할지 여부 결정 
   * @returns {Transform[]} 트랜스폼 리스트 
   */
  static parseStyle(transform, doCache = true) {

    var transforms = [];

    if (!transform) return transforms;


    if (doCache && TransformCache.has(transform)) {
      return TransformCache.get(transform);
    }

    var matches = (transform.match(TRANSFORM_REG) || []);

    matches.forEach((value, index) => {
      var [transformName, transformValue] = value.split("(");
      transformValue = transformValue.split(")")[0];

      var arr = transformValue.split(',');

      if (transformValue.includes('matrix') || transformValue.includes('scale')) {
        arr = arr.map(it => Length.number(it.trim()))
      } else {
        arr = arr.map(it => Length.parse(it.trim()))
      }

      // drop shadow 제외한 나머지 값 지정
      transforms[index] = Transform.parse({
        type: transformName,
        value: arr
      });

    });

    if (doCache) {
      TransformCache.set(transform, transforms);
    }

    return transforms;
  }

  /**
   * Transform 정보를 기준으로 mat4 행렬값으로 변환 
   * 
   * 
   * @param {Transform[]} parsedTransformList 파싱된 Transform 리스트 
   * @param {number} width Layer 의 실제 넓이 
   * @param {number} height Layer 의 실제 높이 
   */
  static createTransformMatrix(parsedTransformList, width, height) {
 
    // start with the identity matrix 
    const view = mat4.create();

    // 3. Multiply by each of the transform functions in transform property from left to right     
    for (let i = 0, len = parsedTransformList.length; i < len; i++) {
      const it = parsedTransformList[i];

      switch (it.type) {
        case 'translate':
        case 'translateX':
        case 'translateY':
        case 'translateZ':
          var values = it.value
          if (it.type === 'translate') {
            values = [values[0].toPx(width).value, values[1].toPx(height).value, 0];
          } else if (it.type === 'translateX') {
            values = [values[0].toPx(width).value, 0, 0];
          } else if (it.type === 'translateY') {
            values = [0, values[0].toPx(height).value, 0];
          } else if (it.type === 'translateZ') {
            values = [0, 0, values[0].toPx().value];
          }

          mat4.translate(view, view, values);
          break;
        case 'rotate':
        case 'rotateZ':
          mat4.rotateZ(view, view, degreeToRadian(it.value[0].value));
          break;
        case 'rotateX':
          mat4.rotateX(view, view, degreeToRadian(it.value[0].value));
          break;
        case 'rotateY':
          mat4.rotateY(view, view, degreeToRadian(it.value[0].value));
          break;
        case 'rotate3d':
          var values = it.value
          mat4.rotate(view, view, degreeToRadian(it.value[3].value), [
            values[0].value,
            values[1].value,
            values[2].value,
          ]);
          break;
        case 'scale':
          mat4.scale(view, view, [it.value[0].value, it.value[1].value, 1]);
          break;
        case 'scaleX':
          mat4.scale(view, view, [it.value[0].value, 1, 1]);
          break;
        case 'scaleY':
          mat4.scale(view, view, [1, it.value[0].value, 1]);
          break;
        case 'scaleZ':
          mat4.scale(view, view, [1, 1, it.value[0].value]);
          break;
        case 'skewX':

          var rad = it.value[0].toDeg().toRad()

          mat4.multiply(view, view, mat4.fromValues(
            1, 0, 0, 0,
            Math.tan(rad.value), 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
          ));
          break;
        case 'skewY':
          var rad = it.value[0].toDeg().toRad()
          mat4.multiply(view, view, mat4.fromValues(
            1, Math.tan(rad.value), 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
          ));
          break;
        case 'skew':
            const skewX = it.value[0].toDeg().toRad();
            const skewY = it.value.length > 1 ? it.value[1].toDeg().toRad() : skewX;
            mat4.multiply(view, view, mat4.fromValues(
              1, Math.tan(skewY.value), 0, 0,
              Math.tan(skewX.value), 1, 0, 0,
              0, 0, 1, 0,
              0, 0, 0, 1,
            ));
            break;
        case 'matrix':
          var values = it.value;
          values = [
            values[0].value, values[1].value, 0, 0,
            values[2].value, values[3].value, 0, 0,
            0, 0, 1, 0,
            values[4].value, values[5].value, 0, 1
          ]
          mat4.multiply(view, view, values);
          break;
        case 'matrix3d':
          var values = it.value.map(it => it.value);
          mat4.multiply(view, view, values);
          break;
        case 'perspective':
          var values = it.value;
          mat4.perspective(view, Math.PI * 0.5, width / height, 1, values[0].value);
          break;
      }
    }

    return view;
  }
  static fromScale(scale) {
    if (scale[0] === 1 && scale[1] === 1) {
      return '';
    }

    const list = [];
    if (scale[0] != 1) list.push(`scaleX(${scale[0]})`);
    if (scale[1] != 1) list.push(`scaleY(${scale[1]})`);
    if (scale[2] != 1) list.push(`scaleZ(${scale[2]})`);

    return list.join(' ');
  }
}