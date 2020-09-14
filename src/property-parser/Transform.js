import { Length } from "@unit/Length";
import { Property } from "@items/Property";
import { isString, isFunction } from "@core/functions/func";

const TRANSFORM_REG = /((matrix|translate(X|Y|Z|3d)?|scale(X|Y|Z|3d)?|rotate(X|Y|Z|3d)?|skew(X|Y)|matrix(3d)?|perspective)\(([^\)]*)\))/gi;

export class Transform extends Property {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({ 
      itemType: "transform", 
      type: '',
      value: [],
      ...obj 
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      value: JSON.parse( JSON.stringify(this.json.value) )
    }
  }

  toString() {
    return `${this.json.type}(${this.json.value.join(', ') || ""})`;
  }



  convert(json) {

    json = super.convert(json);

    if (json.type.includes('matrix') || json.type.includes('scale')) {
      json.value = json.value.map(it => Length.number(it))
    } else {
      json.value = json.value.map(it => Length.parse(it))
    }

    return json 
  }


  static join (list) {

    var firstType = 'perspective'
    var lastType = 'matrix3d'

    var arr = list.filter(it => it.type === firstType)
    var last = list.filter(it => it.type === lastType)
    var arr2 = list.filter(it => it.type !== firstType && it.type !== lastType)

    return [...arr, ...arr2, ...last].map(it => new Transform(it).toString()).join(' ')
  }

  hasNumberValue () {
    var type = this.json.type; 
    return type.includes('matrix') || type.includes('scale')
  }

  static parse (transform) {
    return new Transform(transform);
  }

  static remove (transform, type = []) {

    if (isString(type)) {
      type = [type]
    }  

    return Transform.filter(transform, it => {
        return type.includes(it.type) === false;
    })
  }

  static filter (transform, filterFunction) {
    return Transform.join(Transform.parseStyle(transform).filter(it =>  filterFunction(it)))
  }

  static replace (transform, valueObject) {

    var obj = Transform.parseStyle(transform)

    var tObject = obj.find(t => t.type === valueObject.type);

    if (tObject) {
      tObject.value = valueObject.value
    } else {
      obj.push(valueObject)
    }

    return Transform.join(obj);
  }

  static replaceAll (oldTransform, newTransform) {
    var oldT = Transform.parseStyle(oldTransform)
    var newT = Transform.parseStyle(newTransform)

    for(var i = 0, len = newT.length; i < len ;i++) {
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

  static addTransform (oldTransform, newTransform) {
    var oldT = Transform.parseStyle(oldTransform)
    var newT = Transform.parseStyle(newTransform)

    for(var i = 0, len = newT.length; i < len ;i++) {
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

  static get (transform, type) {
    var arr = Transform.parseStyle(transform)

    if (isFunction(type)) {
      arr = arr.find(type);
    } else {
      arr = arr.find(it => it.type === type);
    }

    if (arr) {
      return arr.value; 
    }

    return [] 
  } 

  static rotate (transform, angle) {
    return Transform.replace(transform, { type: 'rotate', value: [angle] })
  }

  static parseStyle (transform) {

    var transforms = [];

    if (!transform) return transforms;

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
    return transforms;
  }

  static getTransform (from, to) {
    [x0, y0]= from[0]
    [x1, y1]= from[1]
    [x2, y2]= from[2]
    [x3, y3]= from[3]
    [u0, v0]= to[0]
    [u1, v1]= to[1]
    [u2, v2]= to[2]
    [u3, v3]= to[3]    

    const A = [
      [x0, y0, 1, 0, 0, 0, -u0 * x0, -u0 * y0],
      [0, 0, 0, x0, y0, 1, -v0 * x0, -v0 * y0],
      [x1, y1, 1, 0, 0, 0, -u1 * x1, -u1 * y1],
      [0, 0, 0, x1, y1, 1, -v1 * x1, -v1 * y1],
      [x2, y2, 1, 0, 0, 0, -u2 * x2, -u2 * y2],
      [0, 0, 0, x2, y2, 1, -v2 * x2, -v2 * y2],
      [x3, y3, 1, 0, 0, 0, -u3 * x3, -u3 * y3],
      [0, 0, 0, x3, y3, 1, -v3 * x3, -v3 * y3]
    ];

    const B = [
      u0, v0, 
      u1, v1, 
      u2, v2, 
      u3, v3
    ]

    var h = [] 

    for(var i = 0; i < 8; i++) {
      var t = A[0]

      h.push(
        t[0]*B[0] + 
        t[1]*B[1] + 
        t[2]*B[2] + 
        t[3]*B[3] + 
        t[4]*B[4] + 
        t[5]*B[5] + 
        t[6]*B[6] + 
        t[7]*B[7]
      )

    }
    
    var H =[
      [h[0], h[1], 0, h[2]],
      [h[3], h[4], 0, h[5]],
      [   0,    0, 1,    0],
      [h[6], h[7], 0,    1]
    ]

    return H; 

  }

  static makeTransform3d(originalPos, targetPos) {
    var from = []
    var to = [] 

    originalPos.forEach(([a, b]) => {
      from.push(a - originalPos[0][0], b - originalPos[0][1])
    })

    targetPos.forEach(([a, b]) => {
      to.push(a - originalPos[0][0], b - originalPos[0][1])
    })    

    var H = Transform.getTransform(from, to);

    var results = [] 
    H.forEach(a => {
      a.forEach(b => {
        results.push(b);
      })
    })

    var str = results.join(', ');

    return `matrix3d(${str})`
  }

}