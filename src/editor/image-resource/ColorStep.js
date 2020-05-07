import { Item } from "../items/Item";
import { Length } from "../unit/Length";

import { convertMatches } from "../../util/functions/parser";
import { repeat } from "../../util/functions/func";
import { randomNumber } from "../../util/functions/create";
import Color from "../../util/Color";

let colorStepIds = 10000000000; 

function getColorStepId() {
  return colorStepIds++;
} 

export class ColorStep extends Item {
  getDefaultObject() {
    return {
      id: 'c' + getColorStepId(),
      cut: false,
      percent: 0,
      unit: "%",
      px: 0,
      em: 0,
      color: "rgba(0, 0, 0, 0)",
      prevColorStep: null
    };
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      cut: this.json.cut,
      percent: this.json.percent,
      unit: this.json.unit,
      px: this.json.px,
      em: this.json.em,
      color: this.json.color
    }
  }

  on() {
    this.json.cut = true;
  }

  off() {
    this.json.cut = false;
  }

  toggle() {
    this.json.cut = !this.json.cut;
  }

  getUnit() {
    return this.json.unit == "%" ? "percent" : this.json.unit;
  }

  add(num) {
    var unit = this.getUnit();
    this.json[unit] += +num;

    return this;
  }

  sub(num) {
    var unit = this.getUnit();
    this.json[unit] -= +num;

    return this;
  }

  mul(num) {
    var unit = this.getUnit();
    this.json[unit] *= +num;

    return this;
  }

  div(num) {
    var unit = this.getUnit();
    this.json[unit] /= +num;

    return this;
  }

  mod(num) {
    var unit = this.getUnit();
    this.json[unit] %= +num;

    return this;
  }

  get isPx() {
    return this.json.unit == "px";
  }
  get isPercent() {
    return this.json.unit == "%" || this.json.unit === "percent";
  }
  get isEm() {
    return this.json.unit == "em";
  }

  /**
   * convert Length instance
   * @return {Length}
   */
  toLength(maxValue) {
    // TODO: apply maxValue
    return Length.parse(this.json);
  }

  getPrevLength() {
    if (!this.json.prevColorStep) return '';

    return this.json.prevColorStep.toLength();
  }

  /**
   * get color string
   *
   * return {string}
   */
  toString() {
    var prev = this.json.cut ? this.getPrevLength() : ''
    var color = this.json.color || 'transparent'
    return `${color} ${prev} ${this.toLength()}`;
  }

  reset(json) {
    super.reset(json);
    if (this.parent) {
      this.parent.sortColorStep();
    }
  }

  static parse(colorStepString) {
    let colorsteps = [];

    const results = convertMatches(colorStepString);

    var arr = results.str.split(' ').filter(it => it.trim());
    const colorIndex = +arr[0].replace("@", "");
    const color = results.matches[colorIndex].color;

    if (arr.length === 1) {
      colorsteps.push(
        new ColorStep({
          color,
          unit: "%",
          percent: 0,
          hasNotUnit: true 
        })
      );
    } else if (arr.length === 2) {
      const len = Length.parse(arr[1]);

      let data = { unit: len.unit };

      if (len.isPercent()) {
        data.percent = len.value;
      } else if (len.isPx()) {
        data.px = len.value;
      } else if (len.isEm()) {
        data.em = len.value;
      }

      colorsteps.push(new ColorStep({ color, ...data }));
    } else if (arr.length === 3) {  // 이전 객체와의 값이 지정됐을 때? 

      // cut 속성만 줄까? 
      const len = Length.parse(arr[2]);

      let data = { unit: len.unit };

      if (len.isPercent()) {
        data.percent = len.value;
      } else if (len.isPx()) {
        data.px = len.value;
      } else if (len.isEm()) {
        data.em = len.value;
      }

      colorsteps.push(new ColorStep({ color, cut: true, ...data }));
    }

    return colorsteps;
  }

  static createColorStep (maxCount = 2, maxValue = 100, unitType = '%') { 

    var colorStepCount = randomNumber(2, maxCount);
    var unitValue = maxValue/colorStepCount;

    var colorsteps = repeat(colorStepCount).map((_, index) => {
        return `${Color.random()} ${index * unitValue}${unitType}`
    }).join(',');

    return colorsteps;
  }

  static createRepeatColorStep (maxCount = 2, unitValue = Length.px(1)) { 

    var colorStepCount = randomNumber(2, maxCount);

    var colorsteps = repeat(colorStepCount).map((_, index) => {
        return `${Color.random()} ${Length.parse(unitValue).mul(index+1)}`
    }).join(',');

    return colorsteps;
  }  
}
