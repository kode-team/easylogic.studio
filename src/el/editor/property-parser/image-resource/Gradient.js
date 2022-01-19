
import { ImageResource } from "./ImageResource";
import { ColorStep } from "./ColorStep";

import Color from "el/utils/Color";
import { isUndefined } from "el/sapa/functions/func";

const DEFINED_ANGLES = {
  "to top": 0,
  "to top right": 45,
  "to right": 90,
  "to bottom right": 135,
  "to bottom": 180,
  "to bottom left": 225,
  "to left": 270,
  "to top left": 315
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
      ...obj
    };
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      colorsteps: this.json.colorsteps.map(color => color.clone())
    }
  }

  convert(json) {

    if (json.colorsteps[0] instanceof ColorStep) {
      // colorstep instance 를 가지고 있으면 새로운 객체 생성을 하지 않는다. 
    } else {
      json.colorsteps = json.colorsteps.map(c => new ColorStep(c));
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

  insertColorStep(
    percent,
    startColor = "rgba(216,216,216,0)",
    endColor = "rgba(216,216,216,1)"
  ) {
    var colorsteps = this.colorsteps;
    if (!colorsteps.length) {
      this.addColorStepList([
        new ColorStep({ color: startColor, percent, index: 0 }),
        new ColorStep({ color: endColor, percent: 100, index: 100 })
      ]);
      return;
    }

    if (percent < colorsteps[0].percent) {
      colorsteps[0].index = 1;

      this.addColorStep(
        new ColorStep({ index: 0, color: colorsteps[0].color, percent })
      );
      return;
    }

    var lastIndex = colorsteps.length - 1;
    if (colorsteps[lastIndex].percent < percent) {
      var color = colorsteps[lastIndex].color;
      var index = colorsteps[lastIndex].index + 1;

      this.addColorStep(new ColorStep({ index, color, percent }));

      return;
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

        return;
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
    })

    this.sortColorStep();

  }

  sortToLeft() {
    var children = this.colorsteps;
    const length = children.length; 

    const unit = 100 / length;

    children.forEach((it, index) => {
      it.percent = unit * index;
    })

    this.sortColorStep();

  }  

  /**
   * add ColorStep List
   * @param {Array<ColorStep>} colorstepList
   */
  addColorStepList(colorstepList = []) {
    colorstepList.forEach(c => {
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
    return this.json.colorsteps.filter(c => c.id == id)[0];
  }

  clear(...args) {
    if (args.length) {
      this.json.colorsteps.splice(+args[0], 1);
    } else {
      this.json.colorsteps = [];
    }
  }

  removeColorStep(id) {
    this.json.colorsteps = this.json.colorsteps.filter(it => it.id != id)
  }

  /**
   * get colorstep list
   *
   * @return {Array<ColorStep>}
   */
  get colorsteps() {
    return this.json.colorsteps;
  }

  /**
   * get color string
   *
   * @return {string}
   */
  getColorString() {
    var colorsteps = this.colorsteps;

    return Gradient.toColorString(colorsteps);
  }

  static toColorString (colorsteps = [] ) {
    if (!colorsteps.length) return '';

    var newColors = colorsteps.map((c, index) => {
      c.prevColorStep = c.cut && index > 0 ? colorsteps[index - 1] : null;
      return c;
    });

    if (newColors.length === 1) {
      newColors.push(new ColorStep({
        color: newColors[0].color || 'transparent',
        percent: 100 
      }))
    }

    return newColors.map(f => `${f}`).join(",");
  }

}
