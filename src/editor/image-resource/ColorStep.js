import { Item } from "../items/Item";
import { Length } from "../unit/Length";

import { convertMatches } from "../../util/functions/parser";
export class ColorStep extends Item {
  getDefaultObject() {
    return super.getDefaultObject({
      cut: false,
      percent: 0,
      unit: "%",
      px: 0,
      em: 0,
      color: "rgba(0, 0, 0, 0)",
      prevColorStep: null
    });
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
    return `${this.json.color} ${prev} ${this.toLength()}`;
  }

  reset(json) {
    super.reset(json);
    if (this.parent()) {
      this.parent().sortColorStep();
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
          percent: 0
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
    } else if (arr.length === 3) {
      [1, 2].forEach(index => {
        const len = Length.parse(arr[index]);

        let data = { unit: len.unit };

        if (len.isPercent()) {
          data.percent = len.value;
        } else if (len.isPx()) {
          data.px = len.value;
        } else if (len.isEm()) {
          data.em = len.value;
        }

        colorsteps.push(new ColorStep({ color, ...data }));
      });
    }

    return colorsteps;
  }
}
