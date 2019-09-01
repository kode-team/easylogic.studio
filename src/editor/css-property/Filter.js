import { Length } from "../unit/Length";
import { Property } from "../items/Property";
import { convertMatches } from "../../util/functions/parser";
const FILTER_REG = /((blur|drop\-shadow|hue\-rotate|invert|brightness|contrast|opacity|saturate|sepia)\(([^\)]*)\))/gi;
export class Filter extends Property {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({ 
      itemType: "filter", 
      ...obj 
    });
  }

  toString() {
    return `${this.json.type}(${this.json.value || ""})`;
  }

  static parse (obj) {
    var FilterClass = FilterClassName[obj.type];

    if (FilterClass) {
      return new FilterClass(obj);
    } else {
      return new URLSvgFilter({
        value: obj.type 
      });
    }
  }  

  static parseStyle (filter) {

    var filters = [];

    if (!filter) return filters;

    var results = convertMatches(filter);
    var matches = (results.str.match(FILTER_REG) || []);
    matches.forEach((value, index) => {
      var [filterName, filterValue] = value.split("(");
      filterValue = filterValue.split(")")[0];

      if (filterName === "drop-shadow") {
        var arr = filterValue.split(" ");
        var colors = arr
          .filter(it => it.includes("@"))
          .map(it => {
            return results.matches[+it.replace("@", "")].color;
          });
        var values = arr.filter(it => !it.includes("@"));

        // drop-shadow 값 설정
        filters[index] = Filter.parse({
          type: filterName,
          offsetX: Length.parse(values[0]),
          offsetY: Length.parse(values[1]),
          blurRadius: Length.parse(values[2]),
          color: colors[0] || "rgba(0, 0, 0, 1)"
        });
      } else {
        // drop shadow 제외한 나머지 값 지정
        filters[index] = Filter.parse({
          type: filterName,
          value: Length.parse(filterValue)
        });
      }
    });
    return filters;
  }

  static join (list) {
    return list.map(it => Filter.parse(it)).join(' ');
  }

}

export class BlurFilter extends Filter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "blur",
      value: BlurFilter.spec.defaultValue
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      value: Length.parse(this.json.value)
    }
  }
}

BlurFilter.spec = {
  title: "Blur",
  inputType: "range",
  min: 0,
  max: 100,
  step: 1,
  unit: 'px',
  units: ["px", "em"],
  defaultValue: Length.px(0)
};

export class URLSvgFilter extends Filter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "svg",
      value: URLSvgFilter.spec.defaultValue
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      value: Length.parse(this.json.value) 
    }
  }

  toString() {
    return `url(#${this.json.value || ""})`;
  }
}

URLSvgFilter.spec = {
  title: "SVG",
  inputType: "select",
  defaultValue: ''
};

export class GrayscaleFilter extends Filter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "grayscale",
      value: GrayscaleFilter.spec.defaultValue
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      value: Length.parse(this.json.value) 
    }
  }
}

GrayscaleFilter.spec = {
  title: "Grayscale",
  inputType: "range",
  min: 0,
  max: 100,
  step: 1,
  unit: '%',
  units: ["%"],
  defaultValue: Length.percent(0)
};

export class HueRotateFilter extends Filter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "hue-rotate",
      value: HueRotateFilter.spec.defaultValue
    });
  }
}

HueRotateFilter.spec = {
  title: "Hue",
  inputType: "range",
  min: 0,
  max: 360,
  step: 1,
  unit: 'deg',
  units: ["deg"],
  defaultValue: Length.deg(0)
};

export class InvertFilter extends Filter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "invert",
      value: InvertFilter.spec.defaultValue
    });
  }
}

InvertFilter.spec = {
  title: "Invert",
  inputType: "range",
  min: 0,
  max: 100,
  step: 1,
  unit: '%',
  units: ["%"],
  defaultValue: Length.percent(0)
};

export class BrightnessFilter extends Filter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "brightness",
      value: BrightnessFilter.spec.defaultValue
    });
  }
}

BrightnessFilter.spec = {
  title: "Brightness",
  inputType: "range",
  min: 0,
  max: 200,
  step: 1,
  unit: '%',
  units: ["%"],
  defaultValue: Length.percent(100)
};

export class ContrastFilter extends Filter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "contrast",
      value: ContrastFilter.spec.defaultValue
    });
  }
}

ContrastFilter.spec = {
  title: "Contrast",
  inputType: "range",
  min: 0,
  max: 200,
  step: 1,
  unit: '%',
  units: ["%"],
  defaultValue: Length.percent(100)
};

export class OpacityFilter extends Filter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "opacity",
      value: OpacityFilter.spec.defaultValue
    });
  }
}

OpacityFilter.spec = {
  title: "Opacity",
  inputType: "range",
  min: 0,
  max: 100,
  step: 1,
  unit: '%',
  units: ["%"],
  defaultValue: Length.percent(100)
};

export class SaturateFilter extends Filter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "saturate",
      value: SaturateFilter.spec.defaultValue
    });
  }
}

SaturateFilter.spec = {
  title: "Saturate",
  inputType: "range",
  min: 0,
  max: 100,
  step: 1,
  unit: '%',
  units: ["%"],
  defaultValue: Length.percent(100)
};

export class SepiaFilter extends Filter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "sepia",
      value: SepiaFilter.spec.defaultValue
    });
  }
}

SepiaFilter.spec = {
  title: "Sepia",
  inputType: "range",
  min: 0,
  max: 100,
  step: 1,
  unit: '%',
  units: ["%"],
  defaultValue: Length.percent(0)
};

export class DropshadowFilter extends Filter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "drop-shadow",
      multi: true,
      offsetX: DropshadowFilter.spec.offsetX.defaultValue,
      offsetY: DropshadowFilter.spec.offsetY.defaultValue,
      blurRadius: DropshadowFilter.spec.blurRadius.defaultValue,
      color: DropshadowFilter.spec.color.defaultValue
    });
  }

  toString() {
    var json = this.json;
    return `drop-shadow(${json.offsetX} ${json.offsetY} ${json.blurRadius} ${json.color})`;
  }
}

DropshadowFilter.spec = {
  offsetX: {
    title: "Offset X",
    inputType: "range",
    min: -100,
    max: 100,
    step: 1,
    defaultValue: Length.px(0),
    unit: 'px',
    units: ["px", "em"]
  },
  offsetY: {
    title: "Offset Y",
    inputType: "range",
    min: -100,
    max: 100,
    step: 1,
    defaultValue: Length.px(0),
    unit: 'px',
    units: ["px", "em"]
  },
  blurRadius: {
    title: "Blur Radius",
    inputType: "range",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: Length.px(0),
    unit: 'px',
    units: ["px", "em", "%"]
  },
  color: {
    title: "Color",
    inputType: "color",
    defaultValue: "rgba(0, 0, 0, 1)",
    unit: 'color'
  }
};

export const FilterClassList = [
  BlurFilter,
  GrayscaleFilter,
  HueRotateFilter,
  InvertFilter,
  BrightnessFilter,
  ContrastFilter,
  OpacityFilter,
  SaturateFilter,
  SepiaFilter,
  DropshadowFilter,
  URLSvgFilter
];

export const FilterClassName = {
  blur: BlurFilter,
  grayscale: GrayscaleFilter,
  "hue-rotate": HueRotateFilter,
  invert: InvertFilter,
  brightness: BrightnessFilter,
  contrast: ContrastFilter,
  opacity: OpacityFilter,
  saturate: SaturateFilter,
  sepia: SepiaFilter,
  "drop-shadow": DropshadowFilter,
  svg: URLSvgFilter
};

export const FilterClass = {
  BlurFilter,
  GrayscaleFilter,
  HueRotateFilter,
  InvertFilter,
  BrightnessFilter,
  ContrastFilter,
  OpacityFilter,
  SaturateFilter,
  SepiaFilter,
  DropshadowFilter,
  URLSvgFilter
};
