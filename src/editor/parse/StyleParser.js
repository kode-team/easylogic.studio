import { keyEach } from "../../util/functions/func";
import { Length } from "../unit/Length";
import { convertMatches, reverseMatches } from "../../util/functions/parser";
import { BoxShadow } from "../css-property/BoxShadow";
import { BackgroundImage } from "../css-property/BackgroundImage";
import { Filter } from "../css-property/Filter";
import { WHITE_STRING } from "../../util/css/types";
import { TextShadow } from "../css-property/TextShadow";
import { BorderImage } from "../css-property/BorderImage";
const FILTER_REG = /((blur|drop\-shadow|hue\-rotate|invert|brightness|contrast|opacity|saturate|sepia)\(([^\)]*)\))/gi;
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
      results.str.split(WHITE_STRING).forEach(str => {
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

    var obj = {};

    if (style["border-radius"]) {
      obj = {
        borderRadius: {
          all: Length.parse(style.borderRadius)
        }
      };
    } else {
      var borderRadius = {};

      if (style.borderTopLeftRadius) {
        borderRadius.topLeft = Length.parse(style.borderTopLeftRadius);
      }

      if (style.borderTopRightRadius) {
        borderRadius.topRight = Length.parse(style.borderTopRightRadius);
      }

      if (style.borderBottomLeftRadius) {
        borderRadius.bottomLeft = Length.parse(style.borderBottomLeftRadius);
      }

      if (style.borderBottomRightRadius) {
        borderRadius.bottomRight = Length.parse(style.borderBottomRightRadius);
      }

      obj = { borderRadius };
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

    if (style.filter) {
      var results = convertMatches(style.filter);

      results.str.match(FILTER_REG).forEach((value, index) => {
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
    }

    return { filters };
  }

  parseBoxShadow() {
    var style = this.getStyle();
    var boxShadows = [];
    if (style["box-shadow"]) {
      var results = convertMatches(style["box-shadow"]);

      boxShadows = results.str.split(",").map(shadow => {
        var values = shadow.split(" ");

        var insets = values.filter(it => it === "inset");
        var colors = values
          .filter(it => it.includes("@"))
          .map(it => {
            return results.matches[+it.replace("@", "")].color;
          });

        var numbers = values.filter(it => {
          return it !== "inset" && !it.includes("@");
        });

        return BoxShadow.parse({
          inset: !!insets.length,
          color: colors[0] || "rgba(0, 0, 0, 1)",
          offsetX: Length.parse(numbers[0] || "0px"),
          offsetY: Length.parse(numbers[1] || "0px"),
          blurRadius: Length.parse(numbers[2] || "0px"),
          spreadRadius: Length.parse(numbers[3] || "0px")
        });
      });
    }

    return { boxShadows };
  }

  parseTextShadow() {
    var style = this.getStyle();
    var textShadows = [];

    if (style["text-shadow"]) {
      var results = convertMatches(style["text-shadow"]);

      textShadows = results.str.split(",").map(shadow => {
        var values = shadow.split(" ");

        var colors = values
          .filter(it => it.includes("@"))
          .map(it => {
            return results.matches[+it.replace("@", "")].color;
          });

        var numbers = values.filter(it => {
          return it !== "inset" && !it.includes("@");
        });

        return TextShadow.parse({
          color: colors[0] || "rgba(0, 0, 0, 1)",
          offsetX: Length.parse(numbers[0] || "0px"),
          offsetY: Length.parse(numbers[1] || "0px"),
          blurRadius: Length.parse(numbers[2] || "0px")
        });
      });
    }

    return { textShadows };
  }

  parseBackgroundImages() {
    var style = this.getStyle();

    var backgroundImages = BackgroundImage.parseStyle(style);

    // console.log(backgroundImages);

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
      var arr = style[styleKey].split(WHITE_STRING);
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

    this.parseBoxModelProperty("margin-top", "marginTop", obj);
    this.parseBoxModelProperty("margin-bottom", "marginBottom", obj);
    this.parseBoxModelProperty("margin-left", "marginLeft", obj);
    this.parseBoxModelProperty("margin-right", "marginRight", obj);

    this.parseBoxModelPropertyOne("padding", obj);

    this.parseBoxModelProperty("padding-top", "paddingTop", obj);
    this.parseBoxModelProperty("padding-bottom", "paddingBottom", obj);
    this.parseBoxModelProperty("padding-left", "paddingLeft", obj);
    this.parseBoxModelProperty("padding-right", "paddingRight", obj);

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
      ...this.parseFilter(),
      ...this.parseBoxShadow(),
      ...this.parseTextShadow(),
      ...this.parseBackgroundImages()
    };

    return data;
  }
}
