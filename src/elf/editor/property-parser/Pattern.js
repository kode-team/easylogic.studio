import { Length } from "elf/editor/unit/Length";
import { PropertyItem } from "elf/editor/items/PropertyItem";
import { BackgroundImage } from "./BackgroundImage";
import { STRING_TO_CSS } from "elf/utils/func";
import { PatternCache } from "./PatternCache";
import { makeGroupFunction, parseValue } from "elf/utils/css-function-parser";

const customFuncMap = {
  check: makeGroupFunction("check"),
  grid: makeGroupFunction("grid"),
  dot: makeGroupFunction("dot"),
  "cross-dot": makeGroupFunction("cross-dot"),
  "diagonal-line": makeGroupFunction("diagonal-line"),
  "vertical-line": makeGroupFunction("vertical-line"),
  "horizontal-line": makeGroupFunction("horizontal-line"),
};

export class Pattern extends PropertyItem {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "pattern",
      ...obj,
    });
  }

  toString() {
    return `${this.json.type}(${this.json.value || ""})`;
  }

  static parse(obj) {
    var PatternClass = PatternClassName[obj.type];

    if (PatternClass) {
      return new PatternClass(obj);
    }
  }

  static parseStyle(pattern) {
    var patterns = [];

    if (!pattern || pattern === "undefined") return patterns;

    pattern = pattern.trim();

    if (PatternCache.has(pattern)) {
      return PatternCache.get(pattern);
    }

    const result = parseValue(pattern, {
      customFuncMap,
    });

    result.forEach((item, index) => {
      const [
        size,
        position,
        foreColor,
        backColor,
        blendMode = [{ matchedString: "normal" }],
        lineSize = [
          { parsed: Length.parse("1px") },
          { parsed: Length.parse("1px") },
        ],
      ] = item.parameters;
      patterns[index] = Pattern.parse({
        type: item.type,
        x: position[0].parsed,
        y: position[1].parsed,
        width: size[0].parsed,
        height: size[1].parsed,
        foreColor: foreColor[0].matchedString,
        backColor: backColor[0].matchedString,
        blendMode: blendMode[0].matchedString,
        lineWidth: lineSize[0].parsed,
        lineHeight: lineSize[1].parsed,
      });
    });

    PatternCache.set(pattern, patterns);

    return patterns;
  }

  static join(list) {
    return list.map((it) => Pattern.parse(it)).join(" ");
  }

  static toCSS(str) {
    let list = [];
    Pattern.parseStyle(str).forEach((it) => {
      list.push.apply(
        list,
        BackgroundImage.parseStyle(STRING_TO_CSS(it.toCSS()))
      );
    });

    return BackgroundImage.joinCSS(list);
  }
}

export class BasePattern extends Pattern {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "base",
      x: 0,
      y: 0,
      width: 20,
      height: 20,
      lineWidth: 1,
      lineHeight: 1,
      foreColor: "black",
      backColor: "white",
      blendMode: "normal",
    });
  }

  convert(json) {
    json = super.convert(json);

    json.width = Length.parse(json.width);
    json.height = Length.parse(json.height);
    json.lineWidth = Length.parse(json.lineWidth);
    json.lineHeight = Length.parse(json.lineHeight);
    json.x = Length.parse(json.x);
    json.y = Length.parse(json.y);

    return json;
  }

  toString() {
    var {
      type,
      width,
      height,
      x,
      y,
      foreColor,
      backColor,
      blendMode,
      lineWidth,
      lineHeight,
    } = this.json;
    return `${type}(${width} ${height}, ${x} ${y}, ${foreColor}, ${backColor}, ${blendMode}, ${lineWidth} ${lineHeight})`;
  }
}

export class CheckPattern extends BasePattern {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "check",
    });
  }

  toCSS() {
    let { width, height, x, y, backColor, foreColor, blendMode } = this.json;

    backColor = backColor || "transparent";
    foreColor = foreColor || "black";

    return `
      background-image: repeating-linear-gradient(45deg, ${foreColor} 25%, ${backColor} 25%, ${backColor} 75%, ${foreColor} 75%, ${foreColor} 100%),repeating-linear-gradient(45deg, ${foreColor} 25%, ${backColor} 25%, ${backColor} 75%, ${foreColor} 75%, ${foreColor} 100%);
      background-position: 0px 0px, ${x} ${y};
      background-size: ${width} ${height}, ${width} ${height};
      background-blend-mode: ${blendMode}, ${blendMode};
    `;
  }
}

export class GridPattern extends BasePattern {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "grid",
    });
  }

  toCSS() {
    let {
      width,
      height,
      lineWidth,
      lineHeight,
      backColor,
      foreColor,
      blendMode,
    } = this.json;

    backColor = backColor || "transparent";
    foreColor = foreColor || "black";

    return `
      background-image: linear-gradient(to bottom,${foreColor} ${lineHeight}, ${backColor} ${lineHeight}),linear-gradient(to right, ${foreColor} ${lineWidth}, ${backColor} ${lineWidth});
      background-size: ${width / 2}px ${height / 2}px, ${width / 2}px ${
      height / 2
    }px;      
      background-blend-mode: ${blendMode}, ${blendMode};      
    `;
  }
}

export class DotPattern extends BasePattern {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "dot",
    });
  }

  toCSS() {
    let { width, height, lineWidth, backColor, foreColor, blendMode } =
      this.json;

    backColor = backColor || "transparent";
    foreColor = foreColor || "black";

    return `
      background-image: radial-gradient(${foreColor} ${lineWidth}, ${backColor} ${lineWidth});
      background-size: ${width / 2}px ${height / 2}px;          
      background-blend-mode: ${blendMode};      
    `;
  }
}

export class CrossDotPattern extends BasePattern {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "cross-dot",
    });
  }

  toCSS() {
    let { width, height, x, y, lineWidth, backColor, foreColor, blendMode } =
      this.json;

    backColor = backColor || "transparent";
    foreColor = foreColor || "black";

    return `
      background-image: radial-gradient(${foreColor} ${lineWidth}, ${backColor} ${lineWidth}),radial-gradient(${foreColor} ${lineWidth}, ${backColor} ${lineWidth});
      background-size: ${width} ${height},${width} ${height};
      background-position: 0px 0px, ${x} ${y};      
      background-blend-mode: multiply, ${blendMode};
    `;
  }
}

export class DiagonalLinePattern extends BasePattern {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "diagonal-line",
    });
  }

  toCSS() {
    let { width, height, x, lineWidth, backColor, foreColor, blendMode } =
      this.json;

    backColor = backColor || "transparent";
    foreColor = foreColor || "black";

    return `
    background-image: repeating-linear-gradient(${x}, ${foreColor} 0px, ${foreColor} ${lineWidth}, ${backColor} 0px, ${backColor} 50%);
    background-size: ${width} ${height};      
    background-blend-mode: ${blendMode};
  `;
  }
}

export class VerticalLinePattern extends BasePattern {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "vertical-line",
    });
  }

  toCSS() {
    let { width, height, x, y, lineWidth, backColor, foreColor, blendMode } =
      this.json;

    backColor = backColor || "transparent";
    foreColor = foreColor || "black";

    return `
      background-image: repeating-linear-gradient(to right, ${foreColor} 0px, ${foreColor} ${lineWidth}, ${backColor} ${lineWidth}, ${backColor} 100%);
      background-size: ${width} ${height}; 
      background-position: ${x} ${y};        
      background-blend-mode: ${blendMode};
    `;
  }
}

export class HorizontalLinePattern extends BasePattern {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "horizontal-line",
    });
  }

  toCSS() {
    let { width, height, x, y, lineWidth, backColor, foreColor, blendMode } =
      this.json;

    backColor = backColor || "transparent";
    foreColor = foreColor || "black";

    return `
      background-image: repeating-linear-gradient( to bottom, ${foreColor} 0px, ${foreColor} ${lineWidth}, ${backColor} ${lineWidth}, ${backColor} 100%);    
      background-position: ${x} ${y};
      background-size: ${width} ${height};   
      background-blend-mode: ${blendMode};
    `;
  }
}

export const PatternClassList = [
  CheckPattern,
  GridPattern,
  DotPattern,
  CrossDotPattern,
  DiagonalLinePattern,
  VerticalLinePattern,
  HorizontalLinePattern,
];

export const PatternClassName = {
  check: CheckPattern,
  grid: GridPattern,
  dot: DotPattern,
  "cross-dot": CrossDotPattern,
  "diagonal-line": DiagonalLinePattern,
  "vertical-line": VerticalLinePattern,
  "horizontal-line": HorizontalLinePattern,
};

export const PatternClass = {
  CheckPattern,
  GridPattern,
  DotPattern,
  CrossDotPattern,
  DiagonalLinePattern,
  VerticalLinePattern,
  HorizontalLinePattern,
};
