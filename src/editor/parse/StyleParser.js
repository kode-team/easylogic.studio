import { keyEach } from "../../util/functions/func";
import { Length } from "../unit/Length";
import { convertMatches, reverseMatches } from "../../util/functions/parser";
import { BoxShadow } from "../css-property/BoxShadow";
import { BackgroundImage } from "../css-property/BackgroundImage";
import { Filter } from "../css-property/Filter";

import { TextShadow } from "../css-property/TextShadow";
import { BorderImage } from "../css-property/BorderImage";
import { Transform } from "../css-property/Transform";
import { Keyframe } from "../css-property/Keyframe";
const OUTLINE_REG = /(auto|none|dotted|dashed|solid|double|groove|ridge|inset|outset)/gi;
export class StyleParser {
  constructor() {
    this.style = {};
  }

  getStyle() {
    return this.style;
  }

  setStyle(styleObject = {}) {
    this.style = styleObject;
  }

  parseSize() {
    var style = this.getStyle();

    var obj = {};

    if (style["width"]) {
      obj.width = Length.parse(style["width"]);
    }

    if (style["height"]) {
      obj.height = Length.parse(style["height"]);
    }

    return obj;
  }

  parseColor() {
    var style = this.getStyle();

    return {
      color: style["color"] || "black",
      backgroundColor: style["background-color"] || "white"
    };
  }

  parseBorder() {
    // style 속성을 기반으로 border 속성 파싱

    var style = this.getStyle();

    var obj = {};
    if (style.border) {
      obj = {
        border: {
          width: Length.parse(style.borderWidth),
          style: style.borderStyle,
          color: style.borderColor
        },
        borderTop: null,
        borderLeft: null,
        borderRight: null,
        borderBottom: null
      };
    } else {
      obj.border = null;
      ["border-top", "border-right", "border-left", "border-bottom"].forEach(
        key => {
          if (style[key]) {
            obj[key] = {
              width: Length.parse(style[`${key}-width`]),
              style: style[`${key}-style`],
              color: style[`${key}-color`]
            };
          } else {
            obj[key] = null;
          }
        }
      );
    }

    var results = {};
    keyEach(obj, (key, value) => {
      if (value) {
        results[key] = value;
      }
    });

    return results;
  }

  parseOutline() {
    // style 속성을 기반으로 border 속성 파싱

    var style = this.getStyle();

    var obj = {};
    if (style.outline) {

      var results = convertMatches(style.outline);
      var color = null;
      var style = ''; 
      var width = ''; 
      results.str.split(' ').forEach(str => {
        if (str.indexOf('@') > -1) {  // check color 
          color = reverseMatches(str, results.matches)
        } else if (OUTLINE_REG.test(str)) { // check style 
          style = str; 
        } else {
          width = Length.parse(str);

          if (width.includes('thick', 'thin', 'medium')) {
            if (width.value === 'thick') width = Length.px(5);
            else if (width.value === 'thin') width = Length.px(1);
            else if (width.value === 'medium') width = Length.px(3);
          }
        }
      })

      if (width)  obj.width = width; 
      if (style)  obj.style = style; 
      if (color)  obj.color = color; 

      return obj; 

    } 

    var results = {};
    keyEach(obj, (key, value) => {
      if (value) {
        results[key] = value;
      }
    });

    return results;
  }

  filterStyle(...args) {
    var style = this.getStyle();

    var results = {};

    for (var i = 0, len = style.length; i < len; i++) {
      results[style[i]] = true;
    }

    var obj = {};
    Object.keys(results)
      .filter(key => args.includes(key))
      .forEach(key => {
        obj[key] = true;
      });

    return obj;
  }

  parseBorderRadius() {
    var style = this.getStyle();

    var obj = { 
        'border-radius': style['border-radius'] || ''
    }

    return obj;
  }

  parseBorderImage () {
    var obj = {} 

    var style = this.getStyle();

    if (style['border-image']) {
      obj.borderImage =  BorderImage.parseStyle(style['border-image'])
    }

    return obj; 
  }

  parseFilter() {
    var filters = [];
    var style = this.getStyle();

    filters = Filter.parseStyle(style.filter);

    return { filters }
  }

  parseTransform() {
    var transforms = [];
    var style = this.getStyle();

    transforms = Transform.parseTransform(style.transform);

    return { transforms }
  }

  parseBoxShadow() {
    var style = this.getStyle();
    var boxShadows = BoxShadow.parseStyle(style['box-shadow']);

    return { boxShadows };
  }

  parseTextShadow() {
    var style = this.getStyle();
    var textShadows = TextShadow.parseStyle(style['text-shadow']);

    return { textShadows }; 
  }

  parseBackgroundImages() {
    var style = this.getStyle();

    var backgroundImages = BackgroundImage.parseStyle(style);

    return { backgroundImages };
  }

  parseBoxModelProperty(styleKey, propertyKey, obj) {
    var style = this.getStyle();
    if (style[styleKey]) {
      obj[propertyKey] = Length.parse(style[styleKey]);
    }
  }

  parseBoxModelPropertyOne(styleKey, obj) {
    var style = this.getStyle();
    if (style[styleKey]) {
      var arr = style[styleKey].split(' ');
      var len = arr.length;

      switch (len) {
        case 1:
          obj[`${styleKey}Top`] = Length.parse(arr[0]);
          obj[`${styleKey}Bottom`] = obj[`${styleKey}Top`].clone();
          obj[`${styleKey}Left`] = obj[`${styleKey}Top`].clone();
          obj[`${styleKey}Right`] = obj[`${styleKey}Top`].clone();
          break;
        case 2:
          obj[`${styleKey}Top`] = Length.parse(arr[0]);
          obj[`${styleKey}Bottom`] = obj[`${styleKey}Top`].clone();
          obj[`${styleKey}Left`] = Length.parse(arr[1]);
          obj[`${styleKey}Right`] = obj[`${styleKey}Left`].clone();
          break;
        case 3:
          obj[`${styleKey}Top`] = Length.parse(arr[0]);
          obj[`${styleKey}Bottom`] = Length.parse(arr[2]);
          obj[`${styleKey}Left`] = Length.parse(arr[1]);
          obj[`${styleKey}Right`] = obj[`${styleKey}Left`].clone();
          break;
      }
    }
  }

  parseBoxModel() {
    var obj = {};

    this.parseBoxModelPropertyOne("margin", obj);

    this.parseBoxModelProperty("margin-top", "margin-top", obj);
    this.parseBoxModelProperty("margin-bottom", "margin-bottom", obj);
    this.parseBoxModelProperty("margin-left", "margin-left", obj);
    this.parseBoxModelProperty("margin-right", "margin-right", obj);

    this.parseBoxModelPropertyOne("padding", obj);

    this.parseBoxModelProperty("padding-top", "padding-top", obj);
    this.parseBoxModelProperty("padding-bottom", "padding-bottom", obj);
    this.parseBoxModelProperty("padding-left", "padding-left", obj);
    this.parseBoxModelProperty("padding-right", "padding-right", obj);

    return obj;
  }

  parseContent() {
    var style = this.getStyle();
    var obj = {};

    if (style.content) {
      obj.content = style.content;
    }

    return obj;
  }

  parseFont() {
    var style = this.getStyle();
    var font = {};

    if (style["line-height"]) {
      font.lineHeight = Length.parse(style["line-height"]);
    }

    if (style["font-size"]) {
      font.size = Length.parse(style["font-size"]);
    }

    if (style["font-stretch"]) {
      font.stretch = Length.parse(style["font-stretch"]);
    }    

    if (style["font-weight"]) {
      font.weight = Length.parse(style["font-weight"]);
    }

    if (style["font-style"]) {
      font.style = Length.parse(style["font-style"]);
    }

    if (style["font-family"]) {
      font.family = Length.parse(style["font-family"]);
    }

    return { font };
  }

  parseText() {
    var style = this.getStyle();
    var text = {};

    if (style["text-transform"]) {
      text.transform = Length.parse(style["text-transform"]);
    }

    if (style["text-decoration"]) {
      text.decoration = Length.parse(style["text-decoration"]);
    }

    return { text };
  }

  parseSpacing() {
    var style = this.getStyle();
    var spacing = {};

    if (style["letter-spacing"]) {
      if (style["letter-spacing"] === "normal") {
        spacing.letter = Length.px(0);
      } else {
        spacing.letter = Length.parse(style["letter-spacing"]);
      }
    }

    if (style["word-spacing"]) {
      if (style["word-spacing"] === "normal") {
        spacing.word = Length.px(0);
      } else {
        spacing.word = Length.parse(style["word-spacing"]);
      }
    }

    if (style["text-indent"]) {
      if (style["text-indent"] === "normal") {
        spacing.indent = Length.px(0);
      } else {
        spacing.indent = Length.parse(style["text-indent"]);
      }
    }

    return { spacing };
  }

  /**
   * 
   * name offset property value, name offset property value, name offset property value,
   * 
   */
  parseKeyframe () {
    var style = this.getStyle();

    var keyframes = Keyframe.parseStyle(style);

    return { keyframes };
  }

  parse(style) {
    this.setStyle(style);

    // $target 의 설정 가능한 값 파싱하기
    var data = {
      ...this.parseFont(),
      ...this.parseText(),
      ...this.parseSpacing(),
      ...this.parseContent(),
      ...this.parseSize(),
      ...this.parseBoxModel(),
      ...this.parseColor(),
      ...this.parseBorder(),
      ...this.parseOutline(),
      ...this.parseBorderRadius(),
      ...this.parseBorderImage(),
      ...this.parseTransform(),
      ...this.parseFilter(),
      ...this.parseBoxShadow(),
      ...this.parseTextShadow(),
      ...this.parseBackgroundImages(),
      ...this.parseKeyframe()
    };

    return data;
  }
}
