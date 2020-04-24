import { Length } from "../unit/Length";
import { Property } from "../items/Property";
import { convertMatches, reverseMatches } from "../../util/functions/parser";
import { BackgroundImage } from "./BackgroundImage";
import { STRING_TO_CSS } from "../../util/functions/func";
const PATTERN_REG = /((check|grid|dot|cross\-dot|diagonal\-line|vertical\-line|horizontal\-line|)\(([^\)]*)\))/gi;

export class Pattern extends Property {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({ 
      itemType: "pattern", 
      ...obj 
    });
  }

  toString() {
    return `${this.json.type}(${this.json.value || ""})`;
  }

  static parse (obj) {
    var PatternClass = PatternClassName[obj.type];

    if (PatternClass) {
      return new PatternClass(obj);
    }
  }  

  static parseStyle (pattern) {

    var patterns = [];

    if (!pattern) return patterns;

    var results = convertMatches(pattern);

    var matches = (results.str.match(PATTERN_REG) || []);
    matches.forEach((value, index) => {
      var [patternName, patternValue] = value.split("(");
      patternValue = patternValue.split(")")[0];

        var [size, position, foreColor, backColor] = patternValue.split(",").map(it => it.trim());

        var [width, height] = size.split(' ');
        var [x, y] = position.split(' ');

        patterns[index] = Pattern.parse({
          type: patternName,
          x: Length.parse(x),
          y: Length.parse(y),
          width: Length.parse(width),
          height: Length.parse(height),          
          foreColor: reverseMatches(foreColor, results.matches),
          backColor: reverseMatches(backColor, results.matches),
        });
    });

    return patterns;
  }

  static join (list) {
    return list.map(it => Pattern.parse(it)).join(' ');
  }

  static toCSS(str) {
    let list = [];
    Pattern.parseStyle(str).forEach(it => {
     list.push(...BackgroundImage.parseStyle(STRING_TO_CSS(it.toCSS())))
    });

    return BackgroundImage.joinCSS(list);
  }
}

export class BasePattern extends Pattern {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "base",
      x: Length.px(0),
      y: Length.px(0),
      width: Length.px(20),
      height: Length.px(20),
      foreColor: 'black',
      backColor: 'white',
    });
  }

  toString() {
    var json = this.json;
    return `${json.type}(${json.width} ${json.height}, ${json.x} ${json.y}, ${json.foreColor}, ${json.backColor})`;
  }
}

export class CheckPattern extends BasePattern {
  getDefaultObject() {
    return super.getDefaultObject({
      type: 'check'
    })
  }

  toCSS() {
    const { width, height, x, y, backColor, foreColor} = this.json; 
    return `
      background-image: repeating-linear-gradient(45deg, ${foreColor} 25%, ${backColor} 25%, ${backColor} 75%, ${foreColor} 75%, ${foreColor} 100%),repeating-linear-gradient(45deg, ${foreColor} 25%, ${backColor} 25%, ${backColor} 75%, ${foreColor} 75%, ${foreColor} 100%);
      background-position: 0px 0px, ${x} ${y};
      background-size: ${width} ${height}, ${width} ${height};
    `
  }
}

export class GridPattern extends BasePattern {
  getDefaultObject() {
    return super.getDefaultObject({
      type: 'grid'
    })
  }
}

export class DotPattern extends BasePattern {
  getDefaultObject() {
    return super.getDefaultObject({
      type: 'dot'
    })
  }
}

export class CrossDotPattern extends BasePattern {
  getDefaultObject() {
    return super.getDefaultObject({
      type: 'cross-dot'
    })
  }
}

export class DiagonalLinePattern extends BasePattern {
  getDefaultObject() {
    return super.getDefaultObject({
      type: 'diagonal-line'
    })
  }
}

export class VerticalLinePattern extends BasePattern {
  getDefaultObject() {
    return super.getDefaultObject({
      type: 'vertical-line'
    })
  }
}


export class HorizontalLinePattern extends BasePattern {
  getDefaultObject() {
    return super.getDefaultObject({
      type: 'horizontal-line'
    })
  }
}



export const PatternClassList = [
  CheckPattern,
  GridPattern,
  DotPattern,
  CrossDotPattern,
  DiagonalLinePattern,
  VerticalLinePattern,
  HorizontalLinePattern
];

export const PatternClassName = {
  check: CheckPattern,
  grid: GridPattern,
  dot: DotPattern,
  'cross-dot': CrossDotPattern,
  'diagonal-line': DiagonalLinePattern,
  'vertical-line': VerticalLinePattern,
  'horizontal-line': HorizontalLinePattern
};

export const PatternClass = {
  CheckPattern,
  GridPattern,
  DotPattern,
  CrossDotPattern,
  DiagonalLinePattern,
  VerticalLinePattern,
  HorizontalLinePattern
};
