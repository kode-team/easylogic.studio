import {
  UNIT_DEG,
  UNIT_PERCENT,
  UNIT_COLOR,
  UNIT_PX
} from "../../util/css/types";
import { Length } from "../unit/Length";
import { Property } from "../items/Property";

export class BackdropFilter extends Property {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({ itemType: "filter", ...obj });
  }

  toString() {
    return `${this.json.type}(${this.json.value || ""})`;
  }
}

export class BackdropBlurFilter extends BackdropFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "blur",
      value: BackdropBlurFilter.spec.defaultValue
    });
  }
}

BackdropBlurFilter.spec = {
  title: "Blur",
  inputType: "range",
  min: 0,
  max: 100,
  step: 1,
  unit: UNIT_PX,
  defaultValue: Length.px(0)
};

export class BackdropGrayscaleFilter extends BackdropFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "grayscale",
      value: BackdropGrayscaleFilter.spec.defaultValue
    });
  }
}

BackdropGrayscaleFilter.spec = {
  title: "Grayscale",
  inputType: "range",
  min: 0,
  max: 100,
  step: 1,
  unit: UNIT_PERCENT,
  defaultValue: Length.percent(0)
};

export class BackdropHueRotateFilter extends BackdropFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "hue-rotate",
      value: BackdropHueRotateFilter.spec.defaultValue
    });
  }
}

BackdropHueRotateFilter.spec = {
  title: "Hue",
  inputType: "range",
  min: 0,
  max: 360,
  step: 1,
  unit: UNIT_DEG,
  defaultValue: Length.deg(0)
};

export class BackdropInvertFilter extends BackdropFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "invert",
      value: BackdropInvertFilter.spec.defaultValue
    });
  }
}

BackdropInvertFilter.spec = {
  title: "Invert",
  inputType: "range",
  min: 0,
  max: 100,
  step: 1,
  unit: UNIT_PERCENT,
  defaultValue: Length.percent(0)
};

export class BackdropBrightnessFilter extends BackdropFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "brightness",
      value: BackdropBrightnessFilter.spec.defaultValue
    });
  }
}

BackdropBrightnessFilter.spec = {
  title: "Brightness",
  inputType: "range",
  min: 0,
  max: 200,
  step: 1,
  unit: UNIT_PERCENT,
  defaultValue: Length.percent(100)
};

export class BackdropContrastFilter extends BackdropFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "contrast",
      value: BackdropContrastFilter.spec.defaultValue
    });
  }
}

BackdropContrastFilter.spec = {
  title: "Contrast",
  inputType: "range",
  min: 0,
  max: 200,
  step: 1,
  unit: UNIT_PERCENT,
  defaultValue: Length.percent(100)
};

export class BackdropOpacityFilter extends BackdropFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "opacity",
      value: BackdropOpacityFilter.spec.defaultValue
    });
  }
}

BackdropOpacityFilter.spec = {
  title: "Opacity",
  inputType: "range",
  min: 0,
  max: 100,
  step: 1,
  unit: UNIT_PERCENT,
  defaultValue: Length.percent(100)
};

export class BackdropSaturateFilter extends BackdropFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "saturate",
      value: BackdropSaturateFilter.spec.defaultValue
    });
  }
}

BackdropSaturateFilter.spec = {
  title: "Saturate",
  inputType: "range",
  min: 0,
  max: 100,
  step: 1,
  unit: UNIT_PERCENT,
  defaultValue: Length.percent(100)
};

export class BackdropSepiaFilter extends BackdropFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "sepia",
      value: BackdropSepiaFilter.spec.defaultValue
    });
  }
}

BackdropSepiaFilter.spec = {
  title: "Sepia",
  inputType: "range",
  min: 0,
  max: 100,
  step: 1,
  unit: UNIT_PERCENT,
  defaultValue: Length.percent(0)
};

export class BackdropDropshadowFilter extends BackdropFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "drop-shadow",
      multi: true,
      offsetX: BackdropDropshadowFilter.spec.offsetX.defaultValue,
      offsetY: BackdropDropshadowFilter.spec.offsetY.defaultValue,
      blurRadius: BackdropDropshadowFilter.spec.blurRadius.defaultValue,
      color: BackdropDropshadowFilter.spec.color.defaultValue
    });
  }

  toString() {
    var json = this.json;
    return `drop-shadow(${json.offsetX} ${json.offsetY} ${json.blurRadius} ${
      json.color
    })`;
  }
}

BackdropDropshadowFilter.spec = {
  offsetX: {
    title: "Offset X",
    inputType: "range",
    min: -100,
    max: 100,
    step: 1,
    defaultValue: Length.px(0),
    unit: UNIT_PX
  },
  offsetY: {
    title: "Offset Y",
    inputType: "range",
    min: -100,
    max: 100,
    step: 1,
    defaultValue: Length.px(0),
    unit: UNIT_PX
  },
  blurRadius: {
    title: "Blur Radius",
    inputType: "range",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: Length.px(0),
    unit: UNIT_PX
  },
  color: {
    title: "Color",
    inputType: "color",
    defaultValue: "rgba(0, 0, 0, 0)",
    unit: UNIT_COLOR
  }
};

export const BackdropFilterClassList = [
  BackdropBlurFilter,
  BackdropGrayscaleFilter,
  BackdropHueRotateFilter,
  BackdropInvertFilter,
  BackdropBrightnessFilter,
  BackdropContrastFilter,
  BackdropOpacityFilter,
  BackdropSaturateFilter,
  BackdropSepiaFilter,
  BackdropDropshadowFilter
];

export const BackdropFilterClassName = {
  blur: BackdropBlurFilter,
  grayscale: BackdropGrayscaleFilter,
  "hue-rotate": BackdropHueRotateFilter,
  invert: BackdropInvertFilter,
  brightness: BackdropBrightnessFilter,
  contrast: BackdropContrastFilter,
  opacity: BackdropOpacityFilter,
  saturate: BackdropSaturateFilter,
  sepia: BackdropSepiaFilter,
  "drop-shadow": BackdropDropshadowFilter
};

export const BackdropFilterClass = {
  BackdropBlurFilter,
  BackdropGrayscaleFilter,
  BackdropHueRotateFilter,
  BackdropInvertFilter,
  BackdropBrightnessFilter,
  BackdropContrastFilter,
  BackdropOpacityFilter,
  BackdropSaturateFilter,
  BackdropSepiaFilter,
  BackdropDropshadowFilter
};

BackdropFilter.parse = obj => {
  var BackdropFilterClass = BackdropFilterClassName[obj.type];

  return new BackdropFilterClass(obj);
};
