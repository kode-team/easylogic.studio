import {
  stringUnit,
  valueUnit,
  percentUnit,
  EMPTY_STRING,
  IMAGE_ITEM_TYPE_LINEAR,
  IMAGE_ITEM_TYPE_REPEATING_LINEAR,
  IMAGE_ITEM_TYPE_RADIAL,
  IMAGE_ITEM_TYPE_REPEATING_RADIAL,
  IMAGE_ITEM_TYPE_CONIC,
  IMAGE_ITEM_TYPE_REPEATING_CONIC,
  IMAGE_ITEM_TYPE_IMAGE,
  IMAGE_ITEM_TYPE_STATIC,
  ITEM_TYPE_LAYER,
  ITEM_TYPE_PAGE,
  ITEM_TYPE_CIRCLE,
  ITEM_TYPE_SHAPE,
  ITEM_TYPE_GROUP,
  ITEM_TYPE_IMAGE,
  ITEM_TYPE_BOXSHADOW,
  ITEM_TYPE_TEXTSHADOW,
  ITEM_TYPE_COLORSTEP,
  ITEM_TYPE_TIMELINE,
  ITEM_TYPE_KEYFRAME,
  CLIP_PATH_TYPE_POLYGON,
  CLIP_PATH_TYPE_NONE,
  CLIP_PATH_TYPE_INSET,
  CLIP_PATH_TYPE_ELLIPSE,
  CLIP_PATH_TYPE_CIRCLE,
  CLIP_PATH_TYPE_SVG,
  WHITE_STRING,
  PROPERTY_DEFAULT_VALUE,
  PROPERTY_LIST,
  ITEM_TYPE_BORDER_IMAGE,
  ITEM_TYPE_MASK_IMAGE,
  ITEM_TYPE_BOX_IMAGE,
  unitValue
} from "./types";
import { parseParamNumber } from "../filter/functions";
import {
  defaultValue,
  isNotUndefined,
  get,
  isNumber,
  isUndefined,
  keyEach,
  isArray,
  cleanObject,
  combineKeyArray
} from "../functions/func";
import Timing from "../animation/Timing";
import { parse } from "../functions/parser";
import { interpolateRGBObject } from "../functions/mixin";
import { format } from "../functions/formatter";
import Dom from "../Dom";

export const DEFAULT_FUNCTION = item => item;

export const LAYER_NAME = item => {
  var { index, name } = item;
  if (index == Number.MAX_SAFE_INTEGER) index = 0;
  return `${1 + index / 100}. ${name || "Layer"}`;
};

export const PAGE_NAME = item => {
  var { index, name } = item;
  if (index == Number.MAX_SAFE_INTEGER) index = 0;
  return `${1 + index / 100}. ${name || "Page"}`;
};

export function IS_PAGE(item) {
  return item.itemType == ITEM_TYPE_PAGE;
}
export function IS_LAYER(item) {
  return item.itemType == ITEM_TYPE_LAYER;
}
export function IS_CIRCLE(item) {
  return item.itemType == ITEM_TYPE_CIRCLE;
}
export function IS_SHAPE(item) {
  return item.itemType == ITEM_TYPE_SHAPE;
}
export function IS_GROUP(item) {
  return item.itemType == ITEM_TYPE_GROUP;
}
export function IS_IMAGE(item) {
  switch (item.itemType) {
    case ITEM_TYPE_IMAGE:
    case ITEM_TYPE_BORDER_IMAGE:
    case ITEM_TYPE_MASK_IMAGE:
    case ITEM_TYPE_BOX_IMAGE:
      return true;
    default:
      return false;
  }
}
export function IS_BOXSHADOW(item) {
  return item.itemType == ITEM_TYPE_BOXSHADOW;
}
export function IS_TEXTSHADOW(item) {
  return item.itemType == ITEM_TYPE_TEXTSHADOW;
}
export function IS_COLORSTEP(item) {
  return item.itemType == ITEM_TYPE_COLORSTEP;
}
export function IS_TIMELINE(item) {
  return item.itemType == ITEM_TYPE_TIMELINE;
}
export function IS_KEYFRAME(item) {
  return item.itemType == ITEM_TYPE_KEYFRAME;
}

export function CLIP_PATH_IS_NONE(item) {
  return item.clipPathType == CLIP_PATH_TYPE_NONE;
}
export function CLIP_PATH_IS_INSET(item) {
  return item.clipPathType == CLIP_PATH_TYPE_INSET;
}
export function CLIP_PATH_IS_ELLIPSE(item) {
  return item.clipPathType == CLIP_PATH_TYPE_ELLIPSE;
}
export function CLIP_PATH_IS_CIRCLE(item) {
  return item.clipPathType == CLIP_PATH_TYPE_CIRCLE;
}
export function CLIP_PATH_IS_POLYGON(item) {
  return item.clipPathType == CLIP_PATH_TYPE_POLYGON;
}
export function CLIP_PATH_IS_SVG(item) {
  return item.clipPathType == CLIP_PATH_TYPE_SVG;
}

export function MAKE_BORDER_RADIUS(layer) {
  var css = {};
  if (layer.fixedRadius) {
    css["border-radius"] = stringUnit(layer.borderRadius);
  } else {
    if (layer.borderTopLeftRadius)
      css["border-top-left-radius"] = stringUnit(layer.borderTopLeftRadius);
    if (layer.borderTopRightRadius)
      css["border-top-right-radius"] = stringUnit(layer.borderTopRightRadius);
    if (layer.borderBottomLeftRadius)
      css["border-bottom-left-radius"] = stringUnit(
        layer.borderBottomLeftRadius
      );
    if (layer.borderBottomRightRadius)
      css["border-bottom-right-radius"] = stringUnit(
        layer.borderBottomRightRadius
      );
  }

  return css;
}

export function MAKE_BORDER_COLOR(layer) {
  var css = {};

  if (layer.borderColor) {
    css["border-color"] = layer.borderColor;
  } else {
    if (layer.borderTopColor) css["border-top-color"] = layer.borderTopColor;
    if (layer.borderRightColor)
      css["border-right-color"] = layer.borderRightColor;
    if (layer.borderBottomColor)
      css["border-bottom-color"] = layer.borderBottomColor;
    if (layer.borderLeftColor) css["border-left-color"] = layer.borderLeftColor;
  }

  return css;
}

export function MAKE_BORDER_STYLE(layer) {
  var css = {};

  if (layer.borderStyle) css["border-style"] = layer.borderStyle;
  if (layer.borderTopStyle) css["border-top-style"] = layer.borderTopStyle;
  if (layer.borderRightStyle)
    css["border-right-style"] = layer.borderRightStyle;
  if (layer.borderBottomStyle)
    css["border-bottom-style"] = layer.borderBottomStyle;
  if (layer.borderLeftStyle) css["border-left-style"] = layer.borderLeftStyle;

  return css;
}

export function MAKE_BORDER_WIDTH(layer) {
  var css = {};

  if (layer.fixedBorderWidth) {
    css["border-width"] = stringUnit(layer.borderWidth);
    css["border-style"] = "solid";
  } else {
    if (layer.borderTopWidth) {
      css["border-top-width"] = stringUnit(layer.borderTopWidth);
      css["border-top-style"] = "solid";
    }

    if (layer.borderRightWidth) {
      css["border-right-width"] = stringUnit(layer.borderRightWidth);
      css["border-right-style"] = "solid";
    }

    if (layer.borderLeftWidth) {
      css["border-left-width"] = stringUnit(layer.borderLeftWidth);
      css["border-left-style"] = "solid";
    }

    if (layer.borderBottomWidth) {
      css["border-bottom-width"] = stringUnit(layer.borderBottomWidth);
      css["border-bottom-style"] = "solid";
    }
  }

  return css;
}

export function MAKE_TRANSFORM(layer) {
  var results = [];

  if (layer.perspective) {
    results.push(`perspective(${layer.perspective}px)`);
  }

  if (layer.rotate) {
    results.push(`rotate(${layer.rotate}deg)`);
  }

  if (layer.skewX) {
    results.push(`skewX(${layer.skewX}deg)`);
  }

  if (layer.skewY) {
    results.push(`skewY(${layer.skewY}deg)`);
  }

  if (layer.scale) {
    results.push(`scale(${layer.scale})`);
  }

  if (layer.translateX) {
    results.push(`translateX(${layer.translateX}px)`);
  }

  if (layer.translateY) {
    results.push(`translateY(${layer.translateY}px)`);
  }

  if (layer.translateZ) {
    results.push(`translateZ(${layer.translateZ}px)`);
  }

  if (layer.rotateX) {
    results.push(`rotateX(${layer.rotateX}deg)`);
  }

  if (layer.rotateY) {
    results.push(`rotateY(${layer.rotateY}deg)`);
  }

  if (layer.rotateZ) {
    results.push(`rotateZ(${layer.rotateZ}deg)`);
  }

  if (layer.scaleX) {
    results.push(`scaleX(${layer.scaleX})`);
  }

  if (layer.scaleY) {
    results.push(`scaleY(${layer.scaleY})`);
  }

  if (layer.scaleZ) {
    results.push(`scaleZ(${layer.scaleZ})`);
  }

  return {
    transform: results.length ? results.join(WHITE_STRING) : "none"
  };
}

export function BOUND_TO_CSS(layer) {
  var css = {};

  if (!layer) return css;

  css.left = stringUnit(layer.x);
  css.top = stringUnit(layer.y);
  css.width = stringUnit(layer.width);
  css.height = stringUnit(layer.height);
  css["z-index"] = layer.index;

  return css;
}

let css = [
  "left",
  "0px",
  "top",
  "0px",
  "width",
  "0px",
  "height",
  "0px",
  "z-index",
  "0"
];

export function BOUND_TO_CSS_ARRAY(layer) {
  if (!layer) return [];

  css[1] = stringUnit(layer.x);
  css[3] = stringUnit(layer.y);
  css[5] = stringUnit(layer.width);
  css[7] = stringUnit(layer.height);
  css[9] = layer.index;

  return css;
}

export function CSS_FILTERING(style) {
  var newStyle = style;

  if (newStyle["background-blend-mode"] == "normal") {
    delete newStyle["background-blend-mode"];
  }

  if (newStyle["mix-blend-mode"] == "normal") {
    delete newStyle["mix-blend-mode"];
  }

  if (newStyle["background-size"] == "auto") {
    delete newStyle["background-size"];
  }

  if (newStyle["background-position"] == "center center") {
    delete newStyle["background-position"];
  }

  if (parseParamNumber(newStyle.opacity) == 1) {
    delete newStyle.opacity;
  }

  if (parseParamNumber(newStyle.left) == 0) {
    delete newStyle.left;
  }

  if (parseParamNumber(newStyle.top) == 0) {
    delete newStyle.top;
  }

  if (newStyle.transform == "none") {
    delete newStyle.transform;
  }

  if (newStyle["transform-style"] == "float") {
    delete newStyle["transform-style"];
  }

  if (newStyle["clip-path"] == "none") {
    delete newStyle["clip-path"];
  }

  return newStyle;
}

export function CSS_GENERATE(css) {
  var results = {};

  keyEach(css, (key, value) => {
    if (!results[key]) {
      results[key] = [];
    }

    results[key].push(value);
  });

  keyEach(results, (key, value) => {
    if (isArray(value)) {
      results[key] = value.join(", ");
    }
  });

  return CSS_FILTERING(results);
}

var ordering = {
  position: 1,
  left: 2,
  top: 2,
  right: 2,
  bottom: 2,
  width: 3,
  height: 3,

  "font-size": 4,
  "font-family": 4,

  opacity: 10,
  "border-radius": 10,

  "box-shadow": 15,
  "text-shadow": 15,
  filter: 15,

  "background-clip": 50,
  "-webkit-background-clip": 50,

  "background-repeat": 100,
  "background-blend-mode": 100,
  "background-image": 100,
  "background-size": 100,
  "background-position": 100,

  transform: 1000
};

const CSS_SORTING_FUNCTION = (a, b) => {

  if (a.includes('--') && !b.includes('--')) {
    return -1; 
  } else if (b.includes('--') && !a.includes('--')) {
    return 1; 
  }

  var aN = ordering[a] || Number.MAX_SAFE_INTEGER;
  var bN = ordering[b] || Number.MAX_SAFE_INTEGER;  

  if (aN == bN) return 0;

  return aN < bN ? -1 : 1;
};

export function CSS_SORTING(style) {
  style = CSS_FILTERING(style);

  var keys = Object.keys(style);

  keys.sort(CSS_SORTING_FUNCTION);

  var newStyle = {};
  keys.forEach(key => {
    newStyle[key] = style[key];
  });

  return newStyle;
}

export function CSS_TO_STRING(style) {
  var newStyle = CSS_SORTING(style);

  return Object.keys(newStyle)
    .filter(key => {
      return !!newStyle[key];
    })
    .map(key => {
      return `${key}: ${newStyle[key]}`;
    })
    .join(";");
}

export function IMAGE_TO_IMAGE(image = null, isExport = false) {
  var url = image.backgroundImage;

  if (!isExport && url) {
    return `url(${url})`;
  } else if (isExport) {
    return `url(${image.backgroundImageDataURI})`;
  }

  return null;
}

export function IMAGE_TO_BACKGROUND_SIZE_STRING(image) {
  if (image.backgroundSize == "contain" || image.backgroundSize == "cover") {
    return image.backgroundSize;
  } else if (image.backgroundSizeWidth && image.backgroundSizeHeight) {
    return [
      stringUnit(image.backgroundSizeWidth),
      stringUnit(image.backgroundSizeHeight)
    ].join(WHITE_STRING);
  } else if (image.backgroundSizeWidth) {
    return stringUnit(image.backgroundSizeWidth);
  }

  return "auto";
}

export function IMAGE_TO_BACKGROUND_POSITION_STRING(image) {
  var x = defaultValue(image.backgroundPositionX, valueUnit("center"));
  var y = defaultValue(image.backgroundPositionY, valueUnit("center"));

  if (x === 0) x = percentUnit(0);
  if (y === 0) y = percentUnit(0);

  return `${stringUnit(x)} ${stringUnit(y)}`;
}

export function IMAGE_BACKGROUND_SIZE_TO_CSS(image = null, isExport = false) {
  var results = {};
  var backgroundPosition = IMAGE_TO_BACKGROUND_POSITION_STRING(image, isExport);
  var backgroundSize = IMAGE_TO_BACKGROUND_SIZE_STRING(image, isExport);
  if (backgroundSize) {
    results["background-size"] = backgroundSize;
  }

  if (backgroundPosition) {
    results["background-position"] = backgroundPosition;
  }
  results["background-image"] =
    "linear-gradient(to right, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))";
  results["background-repeat"] = "no-repeat";

  return results;
}

export function IMAGE_TO_BACKGROUND_REPEAT_STRING(image) {
  if (image.backgroundRepeat) {
    return image.backgroundRepeat;
  }
}

export function IMAGE_TO_BACKGROUND_BLEND_MODE_STRING(image) {
  if (image.backgroundBlendMode) {
    return image.backgroundBlendMode || "normal";
  }
}

export function IMAGE_TO_ITEM_STRING(colorsteps = undefined) {
  if (!colorsteps) return EMPTY_STRING;

  var colors = [...colorsteps];
  if (!colors.length) return EMPTY_STRING;

  var newColors = [];
  colors.forEach((c, index) => {
    if (c.cut && index > 0) {
      newColors.push({
        color: c.color,
        unit: colors[index - 1].unit,
        percent: colors[index - 1].percent,
        px: colors[index - 1].px,
        em: colors[index - 1].em
      });
    }

    newColors.push(c);
  });

  colors = newColors
    .map(f => {
      var value = stringUnit(percentUnit(f.percent));
      return `${f.color} ${value}`;
    })
    .join(",");

  return colors;
}

export function IMAGE_TO_CONIC_ITEM_STRING(colorsteps = undefined) {
  if (!colorsteps) return EMPTY_STRING;

  var colors = [...colorsteps].map((it, index) => {
    it.index = index;
    return it;
  });
  if (!colors.length) return EMPTY_STRING;

  colors.sort((a, b) => {
    if (a.percent == b.percent) {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return 0;
      return 0;
    }
    return a.percent > b.percent ? 1 : -1;
  });

  var newColors = [];
  colors.forEach((c, index) => {
    if (c.cut && index > 0) {
      newColors.push({ ...c, percent: colors[index - 1].percent });
    }

    newColors.push(c);
  });

  colors = newColors
    .map(f => {
      var deg = Math.floor(f.percent * 3.6);
      return `${f.color} ${deg}deg`;
    })
    .join(",");

  return colors;
}

export function IMAGE_TO_LINEAR(image = {}) {
  var colors = IMAGE_TO_ITEM_STRING(image.colorsteps);

  if (colors == EMPTY_STRING) return EMPTY_STRING;

  var opt = EMPTY_STRING;
  var angle = image.angle;
  var gradientType = image.type;

  opt = angle;

  if (isNumber(opt)) {
    opt = DEFINED_DIRECTIONS[`${opt}`] || opt;
  }

  if (isNumber(opt)) {
    opt = opt > 360 ? opt % 360 : opt;

    opt = `${opt}deg`;
  }

  return `${gradientType}-gradient(${opt}, ${colors})`;
}

const DEFINED_DIRECTIONS = {
  "0": "to top",
  "45": "to top right",
  "90": "to right",
  "135": "to bottom right",
  "180": "to bottom",
  "225": "to bottom left",
  "270": "to left",
  "315": "to top left"
};

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

const DEFINED_POSITIONS = {
  ["center"]: true,
  ["top"]: true,
  ["left"]: true,
  ["right"]: true,
  ["bottom"]: true
};

export function IMAGE_TO_RADIAL(image = {}) {
  var colors = IMAGE_TO_ITEM_STRING(image.colorsteps);

  if (colors == EMPTY_STRING) return EMPTY_STRING;
  var opt = EMPTY_STRING;
  var radialType = image.radialType;
  var radialPosition = image.radialPosition || ["center", "center"];
  var gradientType = image.type;

  radialPosition = DEFINED_POSITIONS[radialPosition]
    ? radialPosition
    : radialPosition.join(WHITE_STRING);

  opt = radialPosition ? `${radialType} at ${radialPosition}` : radialType;

  return `${gradientType}-gradient(${opt}, ${colors})`;
}

export function IMAGE_TO_CONIC(image = {}) {
  var colors = IMAGE_TO_CONIC_ITEM_STRING(image.colorsteps);

  if (colors == EMPTY_STRING) return EMPTY_STRING;
  var opt = [];
  var conicAngle = image.angle;
  var conicPosition = image.radialPosition || ["center", "center"];
  var gradientType = image.type;

  conicPosition = DEFINED_POSITIONS[conicPosition]
    ? conicPosition
    : conicPosition.join(WHITE_STRING);

  if (isNotUndefined(conicAngle)) {
    conicAngle = get(DEFINED_ANGLES, conicAngle, it => +it);
    opt.push(`from ${conicAngle}deg`);
  }

  if (conicPosition) {
    opt.push(`at ${conicPosition}`);
  }

  var optString = opt.length ? opt.join(WHITE_STRING) + "," : EMPTY_STRING;

  return `${gradientType}-gradient(${optString} ${colors})`;
}

export function IMAGE_TO_STATIC(image = {}) {
  return IMAGE_TO_LINEAR({
    type: "linear",
    angle: 0,
    colorsteps: [
      { color: image.color, percent: 0 },
      { color: image.color, percent: 100 }
    ]
  });
}

export function IMAGE_TO_IMAGE_STRING(image, isExport = false) {
  var type = image.type;

  if (type == "linear" || type == "repeating-linear") {
    return IMAGE_TO_LINEAR(image, isExport);
  } else if (type == "radial" || type == "repeating-radial") {
    return IMAGE_TO_RADIAL(image, isExport);
  } else if (type == "conic" || type == "repeating-conic") {
    return IMAGE_TO_CONIC(image, isExport);
  } else if (type == "image") {
    return IMAGE_TO_IMAGE(image, isExport);
  } else if (type == "static") {
    return IMAGE_TO_STATIC(image, isExport);
  }
}

export function IMAGE_TO_CSS(image = null, isExport = false) {
  var results = {};

  var backgroundImage = IMAGE_TO_IMAGE_STRING(image, isExport);
  var backgroundPosition = IMAGE_TO_BACKGROUND_POSITION_STRING(image, isExport);
  var backgroundSize = IMAGE_TO_BACKGROUND_SIZE_STRING(image, isExport);
  var backgroundRepeat = IMAGE_TO_BACKGROUND_REPEAT_STRING(image, isExport);
  var backgroundBlendMode = IMAGE_TO_BACKGROUND_BLEND_MODE_STRING(
    image,
    isExport
  );

  if (backgroundImage) {
    results["background-image"] = backgroundImage; // size, position, origin, attachment and etc
  }

  if (backgroundSize) {
    results["background-size"] = backgroundSize;
  }

  if (backgroundPosition) {
    results["background-position"] = backgroundPosition;
  }

  if (backgroundRepeat) {
    results["background-repeat"] = backgroundRepeat;
  }

  if (backgroundBlendMode) {
    results["background-blend-mode"] = backgroundBlendMode;
  }

  return results;
}

const LINEAR_GRADIENT_LIST = [
  IMAGE_ITEM_TYPE_LINEAR,
  IMAGE_ITEM_TYPE_REPEATING_LINEAR
];
const RADIAL_GRADIENT_LIST = [
  IMAGE_ITEM_TYPE_RADIAL,
  IMAGE_ITEM_TYPE_REPEATING_RADIAL
];
const CONIC_GRADIENT_LIST = [
  IMAGE_ITEM_TYPE_CONIC,
  IMAGE_ITEM_TYPE_REPEATING_CONIC
];
const IMAGE_GRADIENT_LIST = [IMAGE_ITEM_TYPE_IMAGE];
const STATIC_GRADIENT_LIST = [IMAGE_ITEM_TYPE_STATIC];

export function IMAGE_TYPE_IS_LINEAR(type) {
  return LINEAR_GRADIENT_LIST.includes(type);
}

export function IMAGE_TYPE_IS_RADIAL(type) {
  return RADIAL_GRADIENT_LIST.includes(type);
}

export function IMAGE_TYPE_IS_CONIC(type) {
  return CONIC_GRADIENT_LIST.includes(type);
}

export function IMAGE_TYPE_IS_IMAGE(type) {
  return IMAGE_GRADIENT_LIST.includes(type);
}

export function IMAGE_TYPE_IS_STATIC(type) {
  return STATIC_GRADIENT_LIST.includes(type);
}

export function IMAGE_ANGLE(angle = EMPTY_STRING) {
  return isUndefined(DEFINED_ANGLES[angle])
    ? angle
    : DEFINED_ANGLES[angle] || 0;
}

export function IMAGE_RADIAL_POSITION(position = EMPTY_STRING) {
  return position;
}

export function IMAGE_TYPE_IS_GRADIENT(type) {
  return (
    IMAGE_TYPE_IS_LINEAR(type) ||
    IMAGE_TYPE_IS_RADIAL(type) ||
    IMAGE_TYPE_IS_CONIC(type)
  );
}

export function IMAGE_TYPE_IS_NOT_GRADIENT(type) {
  return IMAGE_TYPE_IS_GRADIENT(type) == false;
}

export function PATTERN_MAKE(item, patterns = {}) {
  var patternOption = item.pattern || {};
  var patternList = Object.keys(patternOption);

  if (!patternList.length) {
    return null;
  }

  var results = [];
  patternList
    .filter(name => patterns[name])
    .forEach(patternName => {
      if (patternOption[patternName].enable) {
        results.push(
          ...patterns[patternName].make(item, patternOption[patternName])
        );
      }
    });

  results.push(item);

  return results;
}

export function PATTERN_GET(item, patternName) {
  var pattern = item.pattern || {};

  return pattern[patternName] || {};
}

export function generateImagePattern(images, patterns = {}) {
  var results = [];

  images.forEach(item => {
    var patternedItems = PATTERN_MAKE(item, patterns);
    if (patternedItems) {
      results.push(...patternedItems);
    } else {
      results.push(item);
    }
  });

  return results;
}

export function LAYER_BORDER_PREVIEW(layer = null) {
  var css = {};

  css["box-sizing"] = layer.boxSizing || "border-box";

  var results = {
    ...css,
    ...MAKE_BORDER_WIDTH(layer),
    ...MAKE_BORDER_RADIUS(layer),
    ...MAKE_BORDER_COLOR(layer),
    ...MAKE_BORDER_STYLE(layer)
  };

  return CSS_TO_STRING(cleanObject(results));
}

export function LAYER_MAKE_FONT(layer) {
  var results = {};

  if (layer.color) {
    results["color"] = layer.color;
  }

  if (layer.fontSize) {
    results["font-size"] = stringUnit(layer.fontSize);
  }

  if (layer.fontFamily) {
    results["font-family"] = layer.fontFamily;
  }

  if (layer.fontWeight) {
    results["font-weight"] = layer.fontWeight;
  }

  if (isNotUndefined(layer.lineHeight)) {
    results["line-height"] = stringUnit(layer.lineHeight);
  }

  results["word-wrap"] = layer.wordWrap || "break-word";
  results["word-break"] = layer.wordBreak || "break-word";

  if (layer.clipText) {
    results["color"] = "transparent";
    results["background-clip"] = "text";
    results["-webkit-background-clip"] = "text";
  }

  return results;
}

export function PROPERTY_GET_DEFAULT_VALUE(property) {
  return (
    PROPERTY_DEFAULT_VALUE[property] || {
      defaultValue: 0,
      step: 1,
      min: -1000,
      max: 1000
    }
  );
}

export function TIMING_GET_VALUE(targetItem, keyframe, currentTime) {
  // var Scale.makeSetupFunction(start, end);

  var propertyInfo = PROPERTY_GET_DEFAULT_VALUE(keyframe.property);
  var progress =
    (currentTime - keyframe.startTime) /
    (keyframe.endTime - keyframe.startTime);
  var realProgress = Timing[keyframe.timing](progress);

  if (propertyInfo.type == "color") {
    var start = parse(keyframe.startValue);
    var end = parse(keyframe.endValue);
    var value = interpolateRGBObject(start, end, realProgress);

    value = format(value, end.type);
  } else {
    var value =
      keyframe.startValue +
      (keyframe.endValue - keyframe.startValue) * realProgress;
  }

  return value;
}

export function GET_PROPERTY_LIST(item) {
  if (IS_LAYER(item)) {
    return PROPERTY_LIST[item.itemType] || [];
  } else if (IS_IMAGE(item)) {
    return PROPERTY_LIST[`${item.itemType}_${item.type}`] || [];
  }
}
