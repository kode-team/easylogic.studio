import { isNotUndefined, isString, isNumber } from "../../util/functions/func";
import { round } from "../../util/functions/math";

const stringToPercent = {
  center: 50,
  top: 0,
  left: 0,
  right: 100,
  bottom: 100
};

export class Position {}

Position.CENTER = "center";
Position.TOP = "top";
Position.RIGHT = "right";
Position.LEFT = "left";
Position.BOTTOM = "bottom";

const REG_CSS_UNIT = /([\d.]+)(px|pt|fr|r?em|deg|vh|vw|m?s|%|g?rad|turn)/gi;

export class Length {
  constructor(value = "", unit = "") {
    this.value = value;

    if (isNumber(this.value) && isNaN(this.value)) {
      throw new Error('NaN is not able to set')
    }

    this.unit = unit;
  }

  [Symbol.toPrimitive](hint) {
    if (hint == "number") {
      return this.value;
    }

    return this.toString();
  }

  static min(...args) {
    var min = args.shift();

    for (var i = 0, len = args.length; i < len; i++) {
      if (min.value > args[i].value) {
        min = args[i];
      }
    }

    return min;
  }

  static max(...args) {
    var max = args.shift();

    for (var i = 0, len = args.length; i < len; i++) {
      if (max.value < args[i].value) {
        max = args[i];
      }
    }

    return max;
  }

  static string(value) {
    return new Length(value + "", "");
  }

  static number (value) {
    return new Length(+value, 'number')
  }

  static px(value) {
    return new Length(+value, "px");
  }
  static em(value) {
    return new Length(+value, "em");
  }
  static percent(value) {
    return new Length(+value, "%");
  }
  static deg(value) {
    return new Length(+value, "deg");
  }
  static turn(value) {
    return new Length(+value, "turn");
  }  
  static fr(value) {
    return new Length(+value, "fr");
  }

  static second (value) {
    return new Length(+value, 's')
  }

  static ms (value) {
    return new Length(+value, 'ms')
  }  

  static var (value) {
    return new Length(value+'', '--')
  }

  /**
   * return calc()  css fuction string
   *
   * Length.calc(`${Length.percent(100)} - ${Length.px(10)}`)
   *
   * @param {*} str
   */
  static calc(str) {
    return new Length(str, "calc");
  }

  static parse(obj) {
    obj = obj || Length.number(0)

    if (isString(obj)) {
      obj = obj.trim()
      if (obj.indexOf("calc(") > -1) {
        return new Length(obj.split("calc(")[1].split(")")[0], "calc");
      } else {
        var arr = obj.replace(REG_CSS_UNIT, "$1 $2").split(" ").map(it => it.trim());
        var isNumberString = +arr[0] == arr[0];
        if (isNumberString) {
          return new Length(+arr[0], arr[1]);
        } else {
          return new Length(arr[0]);
        }
      }
    }

    if (obj instanceof Length) {
      return obj;
    } else if (obj.unit) {
      if (obj.unit == "%" || obj.unit == "percent") {
        var value = 0;

        if (isNotUndefined(obj.percent)) {
          value = obj.percent;
        } else if (isNotUndefined(obj.value)) {
          value = obj.value;
        }

        return Length.percent(value);
      } else if (obj.unit == "px") {
        var value = 0;

        if (isNotUndefined(obj.px)) {
          value = obj.px;
        } else if (isNotUndefined(obj.value)) {
          value = obj.value;
        }

        return Length.px(value);
      } else if (obj.unit == "em") {
        var value = 0;

        if (isNotUndefined(obj.em)) {
          value = obj.em;
        } else if (isNotUndefined(obj.value)) {
          value = obj.value;
        }

        return Length.em(value);
      } else if (obj.unit == "deg") {
        var value = 0;

        if (isNotUndefined(obj.deg)) {
          value = obj.deg;
        } else if (isNotUndefined(obj.value)) {
          value = obj.value;
        }

        return Length.deg(value);
      } else if (obj.unit == "turn") {
        var value = 0;

        if (isNotUndefined(obj.deg)) {
          value = obj.turn;
        } else if (isNotUndefined(obj.value)) {
          value = obj.value;
        }

        return Length.turn(value);        
      } else if (obj.unit == "s") {
        var value = 0;

        if (isNotUndefined(obj.second)) {
          value = obj.second;
        } else if (isNotUndefined(obj.value)) {
          value = obj.value;
        }

        return Length.second(value);
      } else if (obj.unit == "ms") {
        var value = 0;

        if (isNotUndefined(obj.ms)) {
          value = obj.ms;
        } else if (isNotUndefined(obj.value)) {
          value = obj.value;
        }

        return Length.ms(value);       
        
      } else if (obj.unit == "number") {
        var value = 0;

        if (isNotUndefined(obj.value)) {
          value = obj.value;
        }

        return Length.number(value);
        
      } else if (obj.unit == "--") {
        var value = 0;

        if (isNotUndefined(obj.value)) {
          value = obj.value;
        }

        return Length.var(value);        
      } else if (obj.unit === "" || obj.unit === "string") {
        var value = "";

        if (isNotUndefined(obj.str)) {
          value = obj.str;
        } else if (isNotUndefined(obj.value)) {
          value = obj.value;
        }



        return Length.string(value);
      }
    }

    return Length.string(obj);
  }
  toString() {

    switch(this.unit) {
    case 'string':
    case 'number':
      return this.value + '' 
    case 'var':
        return `var(--${this.value})`
    case 'calc':
      return `calc(${this.value})`;
    default:
      return this.value + this.unit; 
    }
  }

  isUnitType(unit) {
    return this.unit === unit; 
  }

  isCalc()    { return this.isUnitType('calc'); }
  isFr()      { return this.isUnitType('fr'); }
  isPercent() { return this.isUnitType('%'); }
  isPx()      { return this.isUnitType('px'); }
  isEm()      { return this.isUnitType('em'); }
  isDeg()     { return this.isUnitType('deg'); }
  isTurn()    { return this.isUnitType('turn'); }
  isSecond()  { return this.isUnitType('s'); }
  isMs ()     { return this.isUnitType('ms'); }
  isNumber()  { return this.isUnitType('number'); }
  isString()  { return this.isUnitType(''); }
  isVar()     { return this.isUnitType('--'); }
  isNaN()     { return isNumber(this.value) && isNaN(this.value) }

  set(value) {
    this.value = value;

    return this;
  }

  add(obj) {
    this.value += +obj;
    return this;
  }

  sub(obj) {
    return this.add(-1 * obj);
  }

  mul(obj) {
    this.value *= +obj;
    return this;
  }

  div(obj) {
    this.value /= +obj;
    return this;
  }

  mod(obj) {
    this.value %= +obj;
    return this;
  }

  clone() {
    return new Length(this.value, this.unit);
  }

  getUnitName() {
    return this.unit === "%" ? "percent" : this.unit;
  }

  toJSON() {
    return { value: this.value, unit: this.unit };
  }

  rate(value) {
    return value / this.value;
  }

  stringToPercent() {
    if (isNotUndefined(stringToPercent[this.value])) {
      return Length.percent(stringToPercent[this.value]);
    }

    return Length.percent(0);
  }

  stringToEm(maxValue) {
    return this.stringToPercent().toEm(maxValue);
  }

  stringToPx(maxValue) {
    return this.stringToPercent().toPx(maxValue);
  }

  toPercent(maxValue, fontSize = 16) {
    if (this.isPercent()) {
      return this.clone();
    } else if (this.isPx()) {
      return Length.percent((this.value * 100) / maxValue);
    } else if (this.isEm()) {
      return Length.percent((this.value * fontSize * 100) / maxValue);
    } else if (this.isString()) {
      return this.stringToPercent(maxValue);
    } else if (this.isDeg()) {
      return Length.percent((this.value / 360) * 100);
    }
  }

  toEm(maxValue, fontSize = 16) {
    if (this.isPercent()) {
      return Length.em(((this.value / 100) * maxValue) / fontSize);
    } else if (this.isPx()) {
      return Length.em(this.value / fontSize);
    } else if (this.isEm()) {
      return this.clone();
    } else if (this.isString()) {
      return this.stringToEm(maxValue);
    }
  }

  toPx(maxValue, fontSize = 16) {
    if (this.isPercent()) {
      return Length.px((this.value / 100) * maxValue);
    } else if (this.isPx()) {
      return this.clone();
    } else if (this.isEm()) {
      return Length.px(((this.value / 100) * maxValue) / 16);
    } else if (this.isString()) {
      return this.stringToPx(maxValue);
    }
  }

  toDeg() {
    if (this.isDeg()) {
      return this.clone()
    } else if (this.isTurn()) {
      return Length.deg(this.value * 360)
    }
  }

  toTurn() {
    if (this.isTurn()) {
      return this.clone()
    } else if (this.isDeg()) {
      return Length.turn(this.value / 360)
    }
  }


  toSecond () {
    if (this.isSecond()) {
      return this; 
    } else if (this.isMs()) {
      return Length.second(this.value/1000);
    }
  }

  toMs () {
    if (this.isSecond()) {
      return Length.ms(this.value * 1000);
    } else if (this.isMs()) {
      return this; 
    }
  }

  to(unit, maxValue, fontSize = 16) {
    if (unit === "px") {
      return this.toPx(maxValue, fontSize);
    } else if (unit === "%" || unit === "percent") {
      return this.toPercent(maxValue, fontSize);
    } else if (unit === "em") {
      return this.toEm(maxValue, fontSize);
    } else if (unit === "deg") {
      return this.toDeg();      
    } else if (unit === "turn") {
      return this.toTurn();
    }
  }

  toUnit (unit) {
    return new Length(this.value, unit);
  }

  calculate(type, dist) {
    var func = this[type];

    if (func) {
      return func.call(this, dist);
    }

    return this;
  }

  includes (...arr) {
    return arr.includes(this.value);
  }

  round (k) {
    return new Length(round(this.value, k), this.unit)
  }

  equals (t) {
    return this.is(t.value) && this.isUnitType(t.unit); 
  }

  is (value) {
    return this.value === value 
  }
}

Length.auto = Length.string("auto");
