import {
  combineKeyArray,
  cleanObject,
  keyEach,
  isNotUndefined
} from "../../util/functions/func";
import { CSS_TO_STRING, CSS_FILTERING } from "../../util/css/make";
import { Length } from "../unit/Length";
import { NoneClipPath, ClipPath } from "../css-property/ClipPath";
import { Filter } from "../css-property/Filter";
import { BackdropFilter } from "../css-property/BackdropFilter";
import { BackgroundImage } from "../css-property/BackgroundImage";
import { BoxShadow } from "../css-property/BoxShadow";
import { TextShadow } from "../css-property/TextShadow";
import { Display } from "../css-property/Display";
import { editor } from "../editor";
import { GroupItem } from "./GroupItem";
import { EMPTY_STRING } from "../../util/css/types";

export const BLEND_LIST = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity"
];

export class Layer extends GroupItem {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "layer",
      width: Length.px(400),
      height: Length.px(300),
      backgroundColor: "rgba(222, 222, 222, 0.3)",
      position: "absolute",
      x: Length.px(0),
      y: Length.px(0),
      rotate: 0,
      filters: [],
      backdropFilters: [],
      backgroundImages: [],
      boxShadows: [],
      textShadows: [],
      clippath: new NoneClipPath(),
      display: Display.parse({ display: "block" }),
      offset: { left: 0, top: 0, width: 400, height: 300 }, // real dom offset cache
      ...obj
    });
  }

  getDefaultTitle() {
    return "Layer";
  }

  /**
   * 상대좌표 인지 체크
   */
  isLayoutItem() {
    var parent = this.parent();

    return parent.hasLayout(); // 부모가 flex, grid 둘 중 하나를 가지면 자식은 layout item 이 된다.
  }

  isRootItem() {
    var parent = this.parent();

    // 상위 객체가 artboard 나 directory 는 처음 시작하는 존재라고 본다.
    return parent.itemType == "artboard" || parent.itemType == "directory";
  }

  add(layer) {
    if (layer.itemType == "layer") {
      return super.add(layer);
    } else {
      throw new Error("layer 객체입니다.");
    }
  }

  addBackgroundImage(item) {
    this.json.backgroundImages.push(item);
    return item;
  }

  addFilter(item) {
    this.json.filters.push(item);
    return item;
  }

  addBackdropFilter(item) {
    this.json.backdropFilters.push(item);
    return item;
  }

  addBoxShadow(item) {
    this.json.boxShadows.push(item);
    return item;
  }
  addTextShadow(item) {
    this.json.textShadows.push(item);
    return item;
  }

  get texts() {
    return this.search({ itemType: "layer", type: "text" });
  }
  get images() {
    return this.search({ itemType: "layer", type: "image" });
  }

  get filters() {
    return this.json.filters;
  }
  get backdropFilters() {
    return this.json.backdropFilters;
  }
  get backgroundImages() {
    return this.json.backgroundImages || [];
  }
  get boxShadows() {
    return this.json.boxShadows;
  }
  get textShadows() {
    return this.json.textShadows;
  }

  convert(json) {
    json = super.convert(json);

    json.x = Length.parse(json.x);
    json.y = Length.parse(json.y);
    json.width = Length.parse(json.width);
    json.height = Length.parse(json.height);

    if (json.clippath) json.clippath = ClipPath.parse(json.clippath);
    if (json.display) json.display = Display.parse(json.display);

    json.filters = json.filters.map(f => Filter.parse(f));
    json.backdropFilters = json.backdropFilters.map(f =>
      BackdropFilter.parse(f)
    );
    json.backgroundImages = json.backgroundImages.map(f =>
      BackgroundImage.parse(f)
    );
    json.boxShadows = json.boxShadows.map(f => BoxShadow.parse(f));
    json.textShadows = json.textShadows.map(f => TextShadow.parse(f));

    // copy 할 때 자동으로 체크
    if (json.parentId) {
      json.parentPosition = this.getParentPosition(json.parentId).id;
    }

    return json;
  }

  checkField(key, value) {
    if (key === "parentId") {
      this.json.parentPosition = this.getParentPosition(value).id;
    }
    return true;
  }

  getArtBoard() {
    return this.path().filter(it => it.itemType == "artboard")[0];
  }

  getParentPosition(parentId) {
    var path = this.path(parentId);

    return path.filter(it => {
      if (it.itemType == "layer") {
        return !it.isLayoutItem(); // 좌표 설정이 있는 layer 만 부모로 해서 offset 설정
      } else if (it.itemType == "artboard") {
        return true;
      }

      return false;
    })[0];
  }

  parentDirectory() {
    var path = this.path();

    return path.filter(it => {
      if (it.itemType == "directory") {
        return true;
      } else if (it.itemType == "artboard") {
        return true;
      }

      return false;
    })[0];
  }

  get screenX() {
    const offsetParent = editor.get(this.json.parentPosition);
    if (this.isLayoutItem()) {
      return Length.px(offsetParent.screenX.value + this.json.offset.left);
    }

    return Length.px(offsetParent.screenX.value + this.json.x.value);
  }

  get screenX2() {
    return Length.px(this.screenX.value + this.screenWidth.value);
  }

  get screenY() {
    const offsetParent = editor.get(this.json.parentPosition);

    if (this.isLayoutItem()) {
      return Length.px(offsetParent.screenY.value + this.json.offset.top);
    }

    return Length.px(offsetParent.screenY.value + this.json.y.value);
  }

  get screenY2() {
    return Length.px(this.screenY.value + this.screenHeight.value);
  }

  get screenWidth() {
    if (this.isLayoutItem()) {
      return Length.px(this.json.offset.width);
    }

    return this.json.width;
  }

  get screenHeight() {
    if (this.isLayoutItem()) {
      return Length.px(this.json.offset.height);
    }

    return this.json.height;
  }

  changeOffsetToPosition() {
    var offset = this.json.offset;
    this.reset({
      x: Length.px(offset.left),
      y: Length.px(offset.top),
      width: Length.px(offset.width),
      height: Length.px(offset.height)
    });
  }

  toString() {
    return CSS_TO_STRING(this.toCSS());
  }

  toClipPathCSS() {
    return this.json.clippath.toCSS();
  }

  toDisplayCSS() {
    return this.json.display.toCSS();
  }

  toPropertyCSS(list) {
    var results = {};
    list.forEach(item => {
      keyEach(item.toCSS(), (key, value) => {
        if (!results[key]) results[key] = [];
        results[key].push(value);
      });
    });

    return combineKeyArray(results);
  }

  toBackgroundImageCSS() {
    return this.toPropertyCSS(this.backgroundImages);
  }
  toBoxShadowCSS() {
    return this.toPropertyCSS(this.boxShadows);
  }
  toTextShadowCSS() {
    return this.toPropertyCSS(this.textShadows);
  }
  toFilterCSS() {
    return this.toPropertyCSS(this.filters);
  }
  toBackdropFilterCSS() {
    return this.toPropertyCSS(this.backdropFilters);
  }
  toFontCSS() {
    var results = {};
    var json = this.json;

    if (json.color) {
      results["color"] = json.color;
    }

    if (json.fontSize) {
      results["font-size"] = json.fontSize;
    }

    if (json.fontFamily) {
      results["font-family"] = json.fontFamily;
    }

    if (json.fontWeight) {
      results["font-weight"] = json.fontWeight;
    }

    if (json.lineHeight) {
      results["line-height"] = json.lineHeight;
    }

    results["word-wrap"] = json.wordWrap || "break-word";
    results["word-break"] = json.wordBreak || "break-word";

    if (json.clipText) {
      results["color"] = "transparent";
      results["background-clip"] = "text";
      results["-webkit-background-clip"] = "text";
    }

    return results;
  }

  toBorderRadiusCSS() {
    var json = this.json;
    var css = {};
    if (json.fixedRadius) {
      css["border-radius"] = json.borderRadius;
    } else {
      if (json.borderTopLeftRadius)
        css["border-top-left-radius"] = json.borderTopLeftRadius;
      if (json.borderTopRightRadius)
        css["border-top-right-radius"] = json.borderTopRightRadius;
      if (json.borderBottomLeftRadius)
        css["border-bottom-left-radius"] = json.borderBottomLeftRadius;
      if (json.borderBottomRightRadius)
        css["border-bottom-right-radius"] = json.borderBottomRightRadius;
    }

    return css;
  }

  toBorderColorCSS() {
    var json = this.json;
    var css = {};

    if (json.borderColor) {
      css["border-color"] = json.borderColor;
    } else {
      if (json.borderTopColor) css["border-top-color"] = json.borderTopColor;
      if (json.borderRightColor)
        css["border-right-color"] = json.borderRightColor;
      if (json.borderBottomColor)
        css["border-bottom-color"] = json.borderBottomColor;
      if (json.borderLeftColor) css["border-left-color"] = json.borderLeftColor;
    }

    return css;
  }

  toBorderStyleCSS() {
    var json = this.json;
    var css = {};

    if (json.borderStyle) css["border-style"] = json.borderStyle;
    if (json.borderTopStyle) css["border-top-style"] = json.borderTopStyle;
    if (json.borderRightStyle)
      css["border-right-style"] = json.borderRightStyle;
    if (json.borderBottomStyle)
      css["border-bottom-style"] = json.borderBottomStyle;
    if (json.borderLeftStyle) css["border-left-style"] = json.borderLeftStyle;

    return css;
  }

  toBorderWidthCSS() {
    var json = this.json;
    var css = {};

    if (json.fixedBorderWidth) {
      css["border-width"] = json.borderWidth;
      css["border-style"] = "solid";
    } else {
      if (json.borderTopWidth) {
        css["border-top-width"] = json.borderTopWidth;
        css["border-top-style"] = "solid";
      }

      if (json.borderRightWidth) {
        css["border-right-width"] = json.borderRightWidth;
        css["border-right-style"] = "solid";
      }

      if (json.borderLeftWidth) {
        css["border-left-width"] = json.borderLeftWidth;
        css["border-left-style"] = "solid";
      }

      if (json.borderBottomWidth) {
        css["border-bottom-width"] = json.borderBottomWidth;
        css["border-bottom-style"] = "solid";
      }
    }

    return css;
  }

  toTransformCSS() {
    var json = this.json;
    var results = [];

    if (json.perspective) {
      results.push(`perspective(${json.perspective}px)`);
    }

    if (json.rotate) {
      results.push(`rotate(${json.rotate}deg)`);
    }

    if (json.skewX) {
      results.push(`skewX(${json.skewX}deg)`);
    }

    if (json.skewY) {
      results.push(`skewY(${json.skewY}deg)`);
    }

    if (json.scale) {
      results.push(`scale(${json.scale})`);
    }

    if (json.translateX) {
      results.push(`translateX(${json.translateX}px)`);
    }

    if (json.translateY) {
      results.push(`translateY(${json.translateY}px)`);
    }

    if (json.translateZ) {
      results.push(`translateZ(${json.translateZ}px)`);
    }

    if (json.rotateX) {
      results.push(`rotateX(${json.rotateX}deg)`);
    }

    if (json.rotateY) {
      results.push(`rotateY(${json.rotateY}deg)`);
    }

    if (json.rotateZ) {
      results.push(`rotateZ(${json.rotateZ}deg)`);
    }

    if (json.scaleX) {
      results.push(`scaleX(${json.scaleX})`);
    }

    if (json.scaleY) {
      results.push(`scaleY(${json.scaleY})`);
    }

    if (json.scaleZ) {
      results.push(`scaleZ(${json.scaleZ})`);
    }

    return {
      transform: results.length ? results.join(WHITE_STRING) : "none"
    };
  }

  toDefaultCSS() {
    var css = {
      ...this.toBoundCSS()
    };
    var json = this.json;

    css["box-sizing"] = json.boxSizing || "border-box";
    css["visibility"] = json.visible ? "visible" : "hidden";
    if (json.backgroundColor) {
      css["background-color"] = json.backgroundColor;
    }

    if (json.mixBlendMode) {
      css["mix-blend-mode"] = json.mixBlendMode || "normal";
    }

    if (json.backgroundClip && !json.clipText) {
      css["background-clip"] = json.backgroundClip || "";
      css["-webkit-background-clip"] = json.backgroundClip || "";
    }

    if (json.opacity) {
      css["opacity"] = json.opacity;
    }

    return css;
  }

  setGridRowColumn(rowStart, columnStart, rowEnd, columnEnd) {
    this.json.gridRowStart = rowStart;
    this.json.gridRowEnd = rowEnd + 1;
    this.json.gridColumnStart = columnStart;
    this.json.gridColumnEnd = columnEnd + 1;
  }

  initGridRowColumn(row, column) {
    this.setGridRowColumn(row, column, row, column);
  }

  toGridString() {
    const {
      gridRowEnd,
      gridRowStart,
      gridColumnEnd,
      gridColumnStart
    } = this.json;
    if (!gridRowEnd) return EMPTY_STRING;

    var distRow = gridRowEnd - gridRowStart;
    var distColumn = gridColumnEnd - gridColumnStart;

    if (distRow == 1 && distColumn == 1) {
      return `(${gridRowStart}, ${gridColumnStart})`;
    }

    return `(${gridRowStart}, ${gridColumnStart}) -> (${gridRowEnd}, ${gridColumnEnd})`;
  }

  toBoundCSS() {
    var json = this.json;
    var parent = this.parent();

    var height = parent.screenHeight.value;
    var width = parent.screenWidth.value;

    var minSize = Math.min(height, width, 100);

    if (parent.display.type == "flex") {
      return {
        // TODO: 어찌 할꼬?
        // bounding 을 너무 다양하게 할 수 있다.
        // 다만 내부의 요소를 공통으로 묶을 것인지 개별로 설정할 것인지
        // 디장인에서 flex 같은 레이아웃을 많이 쓰는가?
        // 최소 고정 크기로 해야할 듯
        flex: `${json.flexGrow || 1} ${json.flexShrink || 1} ${json.flexBasis ||
          "auto"}`
        // width: Length.px(minSize),
        // height: Length.px(minSize),
        // display: 'inline-block'
      };
    } else if (parent.display.type == "grid") {
      const css = {};
      if (isNotUndefined(json.gridRowStart)) {
        css["grid-row-start"] = json.gridRowStart;
      }
      if (isNotUndefined(json.gridRowEnd)) {
        css["grid-row-end"] = json.gridRowEnd;
      }
      if (isNotUndefined(json.gridColumnStart)) {
        css["grid-column-start"] = json.gridColumnStart;
      }
      if (isNotUndefined(json.gridColumnEnd)) {
        css["grid-column-end"] = json.gridColumnEnd;
      }

      return css;
    }

    return {
      position: json.position,
      left: json.x,
      top: json.y,
      width: json.width,
      height: json.height
    };
  }

  toCSS() {
    var results = {
      ...this.toDefaultCSS(),
      ...this.toBorderWidthCSS(),
      ...this.toBorderRadiusCSS(),
      ...this.toBorderColorCSS(),
      ...this.toBorderStyleCSS(),
      ...this.toTransformCSS(),
      ...this.toDisplayCSS(),
      ...this.toClipPathCSS(),
      ...this.toFilterCSS(),
      ...this.toBackdropFilterCSS(),
      ...this.toFontCSS(),
      ...this.toBoxShadowCSS(),
      ...this.toTextShadowCSS(),
      ...this.toBackgroundImageCSS()
    };

    return CSS_FILTERING(cleanObject(results));
  }
}
