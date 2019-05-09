import { isNotUndefined, isString } from "../../util/functions/func";

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

const CSS_UNIT_REG = /([\d.]+)(px|pt|fr|r?em|deg|vh|vw|%)/gi;

export class Length {
  constructor(value = "", unit = "") {
    if (unit !== "") {
      value = +value;
    }

    this.value = value;
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
  static fr(value) {
    return new Length(+value, "fr");
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
    if (isString(obj)) {
      if (obj.indexOf("calc(") > -1) {
        return new Length(obj.split("calc(")[1].split(")")[0], "calc");
      } else {
        var arr = obj.replace(CSS_UNIT_REG, "$1 $2").split(" ");
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
    if (this.isCalc()) {
      return `calc(${this.value})`;
    }

    return this.value + this.unit;
  }

  isCalc() {
    return this.unit == "calc";
  }
  isFr() {
    return this.unit == "fr";
  }
  isPercent() {
    return this.unit == "%";
  }
  isPx() {
    return this.unit == "px";
  }
  isEm() {
    return this.unit == "em";
  }
  isDeg() {
    return this.unit == "deg";
  }
  isString() {
    return this.unit === "";
  }

  set(value) {
    this.value = value;
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
      return this;
    } else if (this.isPx()) {
      return Length.percent((this.value * 100) / maxValue);
    } else if (this.isEm()) {
      return Length.percent((this.value * fontSize * 100) / maxValue);
    } else if (this.isString()) {
      return this.stringToPercent(maxValue);
    }
  }

  toEm(maxValue, fontSize = 16) {
    if (this.isPercent()) {
      return Length.em(((this.value / 100) * maxValue) / fontSize);
    } else if (this.isPx()) {
      return Length.em(this.value / fontSize);
    } else if (this.isEm()) {
      return this;
    } else if (this.isString()) {
      return this.stringToEm(maxValue);
    }
  }

  toPx(maxValue, fontSize = 16) {
    if (this.isPercent()) {
      return Length.px((this.value / 100) * maxValue);
    } else if (this.isPx()) {
      return this;
    } else if (this.isEm()) {
      return Length.px(((this.value / 100) * maxValue) / 16);
    } else if (this.isString()) {
      return this.stringToPx(maxValue);
    }
  }

  to(unit, maxValue, fontSize = 16) {
    if (unit === "px") {
      return this.toPx(maxValue, fontSize);
    } else if (unit === "%" || unit === "percent") {
      return this.toPercent(maxValue, fontSize);
    } else if (unit === "em") {
      return this.toEm(maxValue, fontSize);
    }
  }

  calculate(type, dist) {
    var func = this[type];

    if (func) {
      return func.call(this, dist);
    }

    return this;
  }
}

Length.auto = Length.string("auto");
