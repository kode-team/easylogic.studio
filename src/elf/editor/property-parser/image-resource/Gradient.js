import { isUndefined } from "sapa";

import { ColorStep } from "./ColorStep";
import { ImageResource } from "./ImageResource";

import * as Color from "elf/core/color";
import { PathParser } from "elf/core/parser/PathParser";
import { createTimingFunction } from "elf/editor/interpolate";
import { step } from "elf/editor/interpolate/timing-functions/steps";
import { FuncType, TimingFunction } from "elf/editor/types/model";
import { parseOneValue } from "elf/utils/css-function-parser";

const DEFINED_ANGLES = {
  "to top": 0,
  "to top right": 45,
  "to right": 90,
  "to bottom right": 135,
  "to bottom": 180,
  "to bottom left": 225,
  "to left": 270,
  "to top left": 315,
};

export class Gradient extends ImageResource {
  isGradient() {
    return true;
  }

  toString() {
    return "none";
  }

  /**
   * colorsteps = [
   *    new ColorStep({color: 'red', percent: 0}),
   *    new ColorStep({color: 'red', percent: 0})
   * ]
   *
   * @param {*} obj
   */
  getDefaultObject(obj = {}) {
    return {
      itemType: "image-resource",
      type: "gradient",
      colorsteps: [],
      ...obj,
    };
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      colorsteps: this.json.colorsteps.map((color) => color.clone()),
    };
  }

  convert(json) {
    if (json.colorsteps[0] instanceof ColorStep) {
      // colorstep instance 를 가지고 있으면 새로운 객체 생성을 하지 않는다.
    } else {
      json.colorsteps = json.colorsteps.map((c) => new ColorStep(c));
    }

    return json;
  }

  calculateAngle() {
    var angle = this.json.angle;
    return isUndefined(DEFINED_ANGLES[angle])
      ? angle
      : DEFINED_ANGLES[angle] || 0;
  }

  /**
   * add ColorStep
   *
   * @param {ColorStep} colorstep
   * @param {boolean} isSort
   */
  addColorStep(colorstep, isSort = true) {
    this.json.colorsteps.push(colorstep);

    if (isSort) this.sortColorStep();

    return colorstep;
  }

  pickColorStep(percent) {
    var colorsteps = this.colorsteps;
    if (!colorsteps.length) {
      return { percent: 0, color: "rgba(0,0,0,0)" };
    }

    if (percent < colorsteps[0].percent) {
      return {
        percent,
        color: colorsteps[0].color,
      };
    }

    var lastIndex = colorsteps.length - 1;
    if (colorsteps[lastIndex].percent < percent) {
      return {
        percent,
        color: colorsteps[lastIndex].color,
      };
    }

    for (var i = 0, len = colorsteps.length - 1; i < len; i++) {
      var currentStep = colorsteps[i];
      var nextStep = colorsteps[i + 1];

      if (currentStep.percent <= percent && percent <= nextStep.percent) {
        const timing = nextStep.timing;
        switch (timing.name) {
          case TimingFunction.STEPS:
            var func = step(timing.count, timing.direction);
            break;
          case TimingFunction.PATH:
            var func = PathParser.fromSVGString(
              timing.d
            ).toInterpolateFunction();
          // eslint-disable-next-line no-fallthrough
          default:
            var func = createTimingFunction(timing.matchedString);
            break;
        }

        var stopPercent =
          (percent - currentStep.percent) /
          (nextStep.percent - currentStep.percent);
        const color = Color.mix(
          currentStep.color,
          nextStep.color,
          func(stopPercent)
        );

        return {
          percent,
          color,
        };
      }
    }
  }

  insertColorStep(
    percent,
    startColor = "rgba(216,216,216,0)",
    endColor = "rgba(216,216,216,1)"
  ) {
    var colorsteps = this.colorsteps;
    if (!colorsteps.length) {
      this.addColorStepList([
        new ColorStep({ color: startColor, percent, index: 0 }),
        new ColorStep({ color: endColor, percent: 100, index: 100 }),
      ]);
      return;
    }

    if (percent < colorsteps[0].percent) {
      colorsteps[0].index = 1;

      this.addColorStep(
        new ColorStep({ index: 0, color: colorsteps[0].color, percent })
      );
      return 0;
    }

    var lastIndex = colorsteps.length - 1;
    if (colorsteps[lastIndex].percent < percent) {
      var color = colorsteps[lastIndex].color;
      var index = colorsteps[lastIndex].index + 1;

      this.addColorStep(new ColorStep({ index, color, percent }));

      return index;
    }

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

        this.addColorStep(
          new ColorStep({ index: step.index + 1, color, percent })
        );

        return i + 1;
      }
    }
  }

  sortColorStep() {
    var children = this.colorsteps;

    children.sort((a, b) => {
      if (a.percent > b.percent) return 1;
      if (a.percent < b.percent) return -1;
      if (a.percent == b.percent) {
        if (a.index === b.index) return 0;
        return a.index > b.index ? 1 : -1;
      }
    });

    children.forEach((it, index) => {
      it.index = index * 100;
    });
  }

  sortToRight() {
    var children = this.colorsteps;
    const length = children.length;

    const unit = 100 / length;

    children.forEach((it, index) => {
      it.percent = unit * (index + 1);
    });

    this.sortColorStep();
  }

  sortToLeft() {
    var children = this.colorsteps;
    const length = children.length;

    const unit = 100 / length;

    children.forEach((it, index) => {
      it.percent = unit * index;
    });

    this.sortColorStep();
  }

  /**
   * add ColorStep List
   * @param {Array<ColorStep>} colorstepList
   */
  addColorStepList(colorstepList = []) {
    colorstepList.forEach((c) => {
      this.addColorStep(c, false);
    });

    this.sortColorStep();
  }

  /**
   * get color step by id
   *
   * @param {string} id
   */
  getColorStep(id) {
    return this.json.colorsteps.filter((c) => c.id == id)[0];
  }

  clear(...args) {
    if (args.length) {
      this.json.colorsteps.splice(+args[0], 1);
    } else {
      this.json.colorsteps = [];
    }
  }

  removeColorStepByIndex(index) {
    this.json.colorsteps.splice(index, 1);
  }

  removeColorStep(id) {
    this.json.colorsteps = this.json.colorsteps.filter((it) => it.id != id);
  }

  /**
   * get colorstep list
   *
   * @return {Array<ColorStep>}
   */
  get colorsteps() {
    return this.json.colorsteps;
  }

  makeTimingString(timing, timingCount = 1) {
    switch (timing.name) {
      case TimingFunction.LINEAR:
        return ``;
      case TimingFunction.EASE:
      case TimingFunction.EASE_IN:
      case TimingFunction.EASE_OUT:
      case TimingFunction.EASE_IN_OUT:
        return `${timing.name} ${timingCount}`;
      case TimingFunction.STEPS:
        return `steps(${timing.count}, ${timing.direction})`;
      case TimingFunction.PATH:
        return `path(${timing.d}) ${timingCount}`;
      default:
        return `cubic-bezier(${timing.x1}, ${timing.y1}, ${timing.x2}, ${timing.y2}) ${timingCount}`;
    }
  }

  /**
   *
   * @override
   * @returns {string}
   *
   */
  getColorString() {
    return this.colorsteps
      .map((it) => {
        const { color, percent, timing, timingCount } = it;
        return `${color} ${percent}% ${this.makeTimingString(
          timing,
          timingCount
        )}`;
      })
      .join(",");
  }

  static makeColorStepList(colorsteps) {
    const results = [];

    colorsteps.forEach((it, index) => {
      const { color, percent, timing, timingCount } = it;

      var prevColorStep = colorsteps[index - 1];

      if (index === 0) {
        results.push({ color, percent });
        return results;
      }

      switch (timing.name) {
        case TimingFunction.STEPS:
          var func = step(timing.count, timing.direction);
          var localColorSteps = [];
          for (var i = 0; i <= timing.count; i++) {
            var stopPercent =
              prevColorStep.percent +
              (percent - prevColorStep.percent) * (i / timing.count);
            var stopColor = Color.mix(
              prevColorStep.color,
              color,
              func(i / timing.count)
            );

            localColorSteps.push({ percent: stopPercent, color: stopColor });
          }

          localColorSteps.forEach((obj, index) => {
            if (index === 0) {
              results.push({
                percent: prevColorStep.percent,
                color: obj.color,
              });
              results.push(obj);
            } else {
              const prev = localColorSteps[index - 1];
              results.push({ percent: prev.percent, color: obj.color });
              results.push(obj);
            }
          });
          break;
        case TimingFunction.PATH:
          var func = PathParser.fromSVGString(timing.d).toInterpolateFunction();
          var localColorSteps = [];
          for (var i = 0; i <= timingCount; i++) {
            const stopPercent =
              prevColorStep.percent +
              (percent - prevColorStep.percent) * (i / timingCount);
            const stopColor = Color.mix(
              prevColorStep.color,
              color,
              func(i / timingCount)
            );
            localColorSteps.push({ percent: stopPercent, color: stopColor });
          }

          results.push(...localColorSteps);
          break;
        default:
          var func = createTimingFunction(timing.matchedString);
          var localColorSteps = [];
          for (var i = 0; i <= timingCount; i++) {
            const stopPercent =
              prevColorStep.percent +
              (percent - prevColorStep.percent) * (i / timingCount);
            const stopColor = Color.mix(
              prevColorStep.color,
              color,
              func(i / timingCount)
            );
            localColorSteps.push({ percent: stopPercent, color: stopColor });
          }

          results.push(...localColorSteps);
          break;
      }
    });

    return results;
  }

  static toCSSColorString(colorsteps = [], unit = "%", maxValue = 100) {
    const list = Gradient.makeColorStepList(colorsteps);

    return list
      .map((it) => {
        const { color, percent } = it;
        const pos = (percent / 100) * maxValue;
        return `${color} ${pos}${unit}`;
      })
      .join(",");
  }

  static parseColorSteps(colors) {
    return colors.map((it, index) => {
      if (it.length === 1) {
        const prev = colors[index - 1]?.[1] || { parsed: { value: 0 } };
        const next = colors[index + 1]?.[1] || { parsed: { value: 100 } };

        let percent = 0;

        if (!colors[index - 1]) {
          percent = 0;
        } else if (!colors[index + 1]) {
          percent = 100;
        } else {
          percent =
            prev.parsed.value + (next.parsed.value - prev.parsed.value) * 0.5;
        }

        return new ColorStep({
          color: it[0].matchedString,
          percent,
          unit: "%",
          timing: parseOneValue("linear").parsed,
          timingCount: 1,
        });
      }

      if (it.length === 2) {
        return new ColorStep({
          color: it[0].matchedString,
          percent: it[1].parsed.value,
          unit: it[1].parsed.unit,
          timing: parseOneValue("linear").parsed,
          timingCount: 1,
        });
      } else if (it.length === 3) {
        if (it[2].parsed.funcType === FuncType.TIMING) {
          return new ColorStep({
            color: it[0].matchedString,
            percent: it[1].parsed.value,
            unit: it[1].parsed.unit,
            timing: it[2].parsed,
            timingCount: it[3]?.parsed.value,
          });
        }

        return new ColorStep({
          color: it[0].matchedString,
          percent: it[2].parsed.value,
          unit: it[2].parsed.unit,
          timing: parseOneValue(`steps(1, start)`).parsed,
        });
      } else if (it.length === 4) {
        return new ColorStep({
          color: it[0].matchedString,
          percent: it[1].parsed.value,
          unit: it[1].parsed.unit,
          timing: it[2].parsed,
          timingCount: it[3].parsed.value,
        });
      }
    });
  }
}
