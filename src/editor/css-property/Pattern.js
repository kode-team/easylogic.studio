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

        var [size, position, foreColor, backColor, blendMode, lineSize] = patternValue.split(",").map(it => it.trim());

        var [width, height] = size.split(' ');
        var [x, y] = position.split(' ');
        var [lineWidth, lineHeight] = (lineSize || '').split(' ')

        patterns[index] = Pattern.parse({
          type: patternName,
          x: Length.parse(x),
          y: Length.parse(y),
          width: Length.parse(width),
          height: Length.parse(height),          
          foreColor: reverseMatches(foreColor, results.matches),
          backColor: reverseMatches(backColor, results.matches),
          blendMode: blendMode || 'normal',
          lineWidth: Length.parse(lineWidth || '1px'),
          lineHeight: Length.parse(lineHeight || '1px'),
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
      lineWidth: Length.px(1),
      lineHeight: Length.px(1),       
      foreColor: 'black',
      backColor: 'white',
      blendMode: 'normal'
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
      type, width, height, x, y, foreColor, backColor, blendMode, lineWidth, lineHeight
    } = this.json;
    return `${type}(${width} ${height}, ${x} ${y}, ${foreColor}, ${backColor}, ${blendMode}, ${lineWidth} ${lineHeight})`;
  }
}

export class CheckPattern extends BasePattern {
  getDefaultObject() {
    return super.getDefaultObject({
      type: 'check'
    })
  }

  toCSS() {
    let { width, height, x, y, backColor, foreColor, blendMode } = this.json; 

    backColor = backColor || 'transparent'
    foreColor = foreColor || 'black'

    return `
      background-image: repeating-linear-gradient(45deg, ${foreColor} 25%, ${backColor} 25%, ${backColor} 75%, ${foreColor} 75%, ${foreColor} 100%),repeating-linear-gradient(45deg, ${foreColor} 25%, ${backColor} 25%, ${backColor} 75%, ${foreColor} 75%, ${foreColor} 100%);
      background-position: 0px 0px, ${x} ${y};
      background-size: ${width} ${height}, ${width} ${height};
      background-blend-mode: ${blendMode}, ${blendMode};
    `
  }
}

export class GridPattern extends BasePattern {
  getDefaultObject() {
    return super.getDefaultObject({
      type: 'grid',
    })
  }

  toCSS() {
    let { width, height, lineWidth, lineHeight, backColor, foreColor, blendMode } = this.json; 

    backColor = backColor || 'transparent'
    foreColor = foreColor || 'black'

    return `
      background-image: linear-gradient(${foreColor} ${lineHeight}, ${backColor} ${lineHeight}),linear-gradient(to right, ${foreColor} ${lineWidth}, ${backColor} ${lineWidth});
      background-size: ${width.value/2}px ${height.value/2}px, ${width.value/2}px ${height.value/2}px;      
      background-blend-mode: ${blendMode}, ${blendMode};      
    `
  }  


}

export class DotPattern extends BasePattern {
  getDefaultObject() {
    return super.getDefaultObject({
      type: 'dot'
    })
  }

  toCSS() {
    let { width, height, lineWidth, lineHeight, backColor, foreColor, blendMode } = this.json; 

    backColor = backColor || 'transparent'
    foreColor = foreColor || 'black'

    return `
      background-image: radial-gradient(${foreColor} ${lineWidth}, ${backColor} ${lineWidth});
      background-size: ${width.value/2}px ${height.value/2}px;          
      background-blend-mode: ${blendMode};      
    `


  }    
}

export class CrossDotPattern extends BasePattern {
  getDefaultObject() {
    return super.getDefaultObject({
      type: 'cross-dot'
    })
  }


  toCSS() {
    let { width, height, x, y, lineWidth, lineHeight, backColor, foreColor, blendMode } = this.json; 

    backColor = backColor || 'transparent'
    foreColor = foreColor || 'black'

    return `
      background-image: radial-gradient(${foreColor} ${lineWidth}, ${backColor} ${lineWidth}),radial-gradient(${foreColor} ${lineWidth}, ${backColor} ${lineWidth});
      background-size: ${width} ${height},${width} ${height};
      background-position: 0px 0px, ${x} ${y};      
      background-blend-mode: multiply, ${blendMode};
    `


  }      
}

export class DiagonalLinePattern extends BasePattern {
  getDefaultObject() {
    return super.getDefaultObject({
      type: 'diagonal-line'
    })
  }

  toCSS() {
    let { width, height, x, lineWidth, backColor, foreColor, blendMode } = this.json; 

    backColor = backColor || 'transparent'
    foreColor = foreColor || 'black'

    return `
      background-image: repeating-linear-gradient(${x}, ${foreColor} 0, ${foreColor} ${lineWidth}, ${backColor} 0, ${backColor} 50%);
      background-size: ${width} ${height};      
      background-blend-mode: ${blendMode};
    `

  }       
}

export class VerticalLinePattern extends BasePattern {
  getDefaultObject() {
    return super.getDefaultObject({
      type: 'vertical-line'
    })
  }

  toCSS() {
    let { width, height, x, y, lineWidth, backColor, foreColor, blendMode } = this.json; 

    backColor = backColor || 'transparent'
    foreColor = foreColor || 'black'

    return `
      background-image: repeating-linear-gradient(to right, ${foreColor} 0px, ${foreColor} ${lineWidth}, ${backColor} ${lineWidth}, ${backColor} 100%);
      background-size: ${width} ${height}; 
      background-position: ${x} ${y};        
      background-blend-mode: ${blendMode};
    `

  }         
}


export class HorizontalLinePattern extends BasePattern {
  getDefaultObject() {
    return super.getDefaultObject({
      type: 'horizontal-line'
    })
  }

  toCSS() {
    let { width, height, x, y, lineWidth, backColor, foreColor, blendMode } = this.json; 

    backColor = backColor || 'transparent'
    foreColor = foreColor || 'black'

    return `
      background-image: repeating-linear-gradient(0deg, ${foreColor} 0px, ${foreColor} ${lineWidth}, ${backColor} ${lineWidth}, ${backColor} 100%);    
      background-position: ${x} ${y};
      background-size: ${width} ${height};   
      background-blend-mode: ${blendMode};
    `

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
