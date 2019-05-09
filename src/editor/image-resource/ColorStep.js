import { Item } from "../items/Item";
import { Length } from "../unit/Length";
import Color from "../../util/Color";
import { EMPTY_STRING } from "../../util/css/types";
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

  on() {
    this.json.cut = true;
  }

  off() {
    this.json.cut = false;
  }

  toggle() {
    this.json.cut = !this.json.cut;
  }

  changeUnit(unit, unitValue, maxValue) {
    this.json.unit = unit;
    this.json[unit] = unitValue;
    this.reset(this.getUnitValue(maxValue));
  }

  getUnit() {
    return this.json.unit == "%" ? "percent" : this.json.unit;
  }

  getUnitValue(maxValue) {
    if (this.isPX) {
      return {
        px: this.json.px,
        percent: +Length.px(this.json.px).toPercent(maxValue),
        em: +Length.px(this.json.px).toEm(maxValue)
      };
    } else if (this.isEm) {
      return {
        em: this.json.em,
        percent: +Length.em(this.json.em).toPercent(maxValue),
        px: +Length.em(this.json.em).toPx(maxValue)
      };
    }

    return {
      percent: this.json.percent,
      px: +Length.percent(this.json.percent).toPx(maxValue),
      em: +Length.percent(this.json.percent).toEm(maxValue)
    };
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
    if (!this.json.prevColorStep) return EMPTY_STRING;

    return this.json.prevColorStep.toLength();
  }

  /**
   * get color string
   *
   * return {string}
   */
  toString() {
    return `${this.json.color} ${
      this.json.cut ? this.getPrevLength() : EMPTY_STRING
    } ${this.toLength()}`;
  }

  reset(json) {
    super.reset(json);
    if (this.parent()) {
      this.parent().sortColorStep();
    }
  }

  static createByPercent(colorsteps, percent) {
    if (!colorsteps.length) {
      colorsteps.push(
        new ColorStep({ color: "rgba(216,216,216, 0)", percent, index: 0 })
      );
      colorsteps.push(
        new ColorStep({
          color: "rgba(216,216,216, 0)",
          percent: 100,
          index: 100
        })
      );
    } else if (percent < colorsteps[0].percent) {
      colorsteps[0].index = 1;

      colorsteps.push(
        new ColorStep({ index: 0, color: colorsteps[0].color, percent })
      );
    } else {
      var lastIndex = colorsteps.length - 1;
      if (colorsteps[lastIndex].percent < percent) {
        var color = colorsteps[lastIndex].color;
        var index = colorsteps[lastIndex].index + 1;

        colorsteps.push(new ColorStep({ index, color, percent }));
      } else {
        for (var i = 0, len = colorsteps.length - 1; i < len; i++) {
          var step = colorsteps[i];
          var nextStep = colorsteps[i + 1];

          if (step.percent <= percent && percent <= nextStep.percent) {
            var color = Color.mix(
              step.color,
              nextStep.color,
              (percent - step.percent) / (nextStep.percent - step.percent),
              "rgb"
            );

            colorsteps.push(
              new ColorStep({ index: step.index + 1, color, percent })
            );
          }
        }
      }
    }

    ColorStep.sort(colorsteps);
  }

  static sort(colorsteps) {
    colorsteps.sort((a, b) => {
      if (a.percent === b.percent) {
        if (a.index === b.index) return 0;

        return a.index > b.index ? 1 : -1;
      }
      return a.percent > b.percent ? 1 : -1;
    });

    colorsteps.forEach((step, index) => {
      step.index = index * 100;
    });
  }

  static select(colorsteps, selectedId = undefined) {
    if (selectedId) {
      colorsteps.forEach(step => {
        step.selected = step.id === selectedId;
      });
    }

    const selected = colorsteps.filter(step => step.selected);

    if (!selected.length) {
      if (colorsteps[0]) {
        colorsteps[0].selected = true;
      }
    }
  }
}
