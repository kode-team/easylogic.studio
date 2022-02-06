import { Length } from "el/editor/unit/Length";

import { convertMatches } from "el/utils/parser";
import { repeat } from "el/utils/func";
import { randomNumber } from "el/utils/create";
import Color from "el/utils/Color";
import { uuidShort } from 'el/utils/math';
import { TimingFunction } from '../../types/model';
import { parseValue } from "el/utils/css-function-parser";

export class ColorStep {
  constructor (obj = {}) {
    // console.log('colorstep', obj);
    this.id = obj.id || uuidShort();
    this.color = obj.color || 'transparent';
    this.cut = obj.cut || false;
    this.percent = obj.percent || 0;
    this.unit = obj.unit || '%';
    this.px = obj.px || 0;
    this.em = obj.em || 0;
    this.prevColorStep = obj.prevColorStep || null;
    this.timing = obj.timing || parseValue('linear')[0].parsed;
    this.timingCount = obj.timingCount || 1;
  }

  toCloneObject() {
    return {
      id: this.id,
      color: this.color,
      cut: this.cut,
      percent: this.percent,
      unit: this.unit,
      px: this.px,
      em: this.em,
      prevColorStep: this.prevColorStep,
      timing: this.timing,
      timingCount: this.timingCount
    }
  }

  on() {
    this.cut = true;
  }

  off() {
    this.cut = false;
  }

  toggle() {
    this.cut = !this.cut;
  }

  toggleTiming () {

    switch(this.timing.name) {
    case TimingFunction.LINEAR:
      this.timing = parseValue('steps(1, start)')[0].parsed;
      break;
    case TimingFunction.STEPS:
      this.timing = parseValue('ease')[0].parsed;
      this.timingCount = 15;
      break;
    default: 
      this.timing = parseValue('linear')[0].parsed
      this.timingCount = 1; 
      break;
    }
  }

  getUnit() {
    return this.unit == "%" ? "percent" : this.unit;
  }

  add(num) {
    var unit = this.getUnit();
    this[unit] += +num;

    return this;
  }

  sub(num) {
    var unit = this.getUnit();
    this[unit] -= +num;

    return this;
  }

  mul(num) {
    var unit = this.getUnit();
    this[unit] *= +num;

    return this;
  }

  div(num) {
    var unit = this.getUnit();
    this[unit] /= +num;

    return this;
  }

  mod(num) {
    var unit = this.getUnit();
    this[unit] %= +num;

    return this;
  }

  get isPx() {
    return this.unit == "px";
  }
  get isPercent() {
    return this.unit == "%" || this.unit === "percent";
  }
  get isEm() {
    return this.unit == "em";
  }

  /**
   * convert Length instance
   * @return {Length}
   */
  toLength(maxValue) {
    
    if (this.isPx) {
      return Length.px(this.px);
    } else if (this.isPercent) {
      return Length.percent(this.percent);
    } else if (this.isEm) {
      return Length.em(this.em);
    }
  }

  getPrevLength() {
    if (!this.prevColorStep) return '';

    return this.prevColorStep.toLength();
  }

  /**
   * get color string
   *
   * return {string}
   */
  toString() {
    var prev = this.cut ? this.getPrevLength() : ''
    var color = this.color || 'transparent'
    return `${color} ${prev} ${this.toLength()}`;
  }

  setValue(percent, maxValue) {
    if (this.isPx) {
      this.px = maxValue * percent / 100;
    } else if (this.isPercent) {
      this.percent = percent;
    } else if (this.isEm) {
      this.em = (maxValue * percent / 100) / 16
    }

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

  static createRepeatColorStep (maxCount = 2, unitValue = 1) { 

    var colorStepCount = randomNumber(2, maxCount);

    var colorsteps = repeat(colorStepCount).map((_, index) => {
        return `${Color.random()} ${Length.parse(unitValue).mul(index+1)}`
    }).join(',');

    return colorsteps;
  }  
}
