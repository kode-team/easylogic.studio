import { EMPTY_STRING, WHITE_STRING } from "../../util/css/types";
import { CSS_TO_STRING, CSS_SORTING } from "../../util/css/make";
import { Length } from "../unit/Length";
import { Display } from "../css-property/Display";
import { GroupItem } from "./GroupItem";
import { Filter, BlurFilter } from "../css-property/Filter";
import { BackdropFilter } from "../css-property/BackdropFilter";
import { BackgroundImage } from "../css-property/BackgroundImage";
import {
  keyEach,
  combineKeyArray,
  isUndefined
} from "../../util/functions/func";

const borderRadiusCssKey = {
  topLeft: "top-left",
  topRight: "top-right",
  bottomLeft: "bottom-left",
  bottomRight: "bottom-right"
};

const fontStyleList = ["size", "weight", "lineHeight", "family", "style"];
const textStyleList = ["decoration", "transform"];

export class ArtBoard extends GroupItem {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "artboard",
      width: Length.px(300),
      height: Length.px(400),
      backgroundColor: "white",
      color: "black",
      name: "New ArtBoard",
      x: Length.px(100),
      y: Length.px(100),
      filters: [],
      border: {},
      borderRadius: {},
      backdropFilters: [],
      backgroundImages: [],
      boxShadows: [],
      textShadows: [],
      perspectiveOriginPositionX: Length.percent(0),
      perspectiveOriginPositionY: Length.percent(0),
      display: Display.parse({ display: "block" }),
      marginTop: Length.px(0),
      marginBottom: Length.px(0),
      marginRight: Length.px(0),
      marginLeft: Length.px(0),
      paddingTop: Length.px(0),
      paddingBottom: Length.px(0),
      paddingRight: Length.px(0),
      paddingLeft: Length.px(0),
      content: "",
      font: {},
      text: {},
      spacing: {},
      ...obj
    });
  }

  getArtBoard() {
    return this;
  }

  convert(json) {
    json = super.convert(json);

    json.width = Length.parse(json.width);
    json.height = Length.parse(json.height);
    json.x = Length.parse(json.x);
    json.y = Length.parse(json.y);
    json.perspectiveOriginPositionX = Length.parse(
      json.perspectiveOriginPositionX
    );
    json.perspectiveOriginPositionY = Length.parse(
      json.perspectiveOriginPositionY
    );
    json.filters = json.filters.map(f => Filter.parse(f));
    json.backdropFilters = json.backdropFilters.map(f =>
      BackdropFilter.parse(f)
    );
    json.backgroundImages = json.backgroundImages.map(f =>
      BackgroundImage.parse(f)
    );

    if (json.display) json.display = Display.parse(json.display);

    return json;
  }

  getDefaultTitle() {
    return "ArtBoard";
  }

  get directories() {
    return this.search({ itemType: "directory" });
  }

  get allDirectories() {
    return this.tree().filter(it => it.itemType == "directory");
  }

  /**
   * arboard 를 부모로 하고 절대좌표르 가진 layer 만 조회
   */
  get allLayers() {
    return this.tree().filter(it => it.itemType == "layer");
  }

  /** root item 만 조회  */
  get rootItems() {
    return this.tree().filter(it => it.isRootItem());
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

  addBoxShadow(boxShadow) {
    this.json.boxShadows.push(boxShadow);
    return boxShadow;
  }

  addTextShadow(textShadow) {
    this.json.textShadows.push(textShadow);
    return textShadow;
  }

  addBackgroundImage(item) {
    this.json.backgroundImages.push(item);
    return item;
  }

  createBackgroundImage(data = {}) {
    return this.addBackgroundImage(
      new BackgroundImage({
        checked: true,
        ...data
      })
    );
  }

  removeBackgroundImage(removeIndex) {
    this.json.backgroundImages.splice(removeIndex, 1);
  }

  removeBoxShadow(removeIndex) {
    this.json.boxShadows.splice(removeIndex, 1);
  }

  removeTextShadow(removeIndex) {
    this.json.textShadows.splice(removeIndex, 1);
  }

  sortItem(arr, startIndex, targetIndex) {
    arr.splice(
      targetIndex + (startIndex < targetIndex ? -1 : 0),
      0,
      ...arr.splice(startIndex, 1)
    );
  }

  sortBackgroundImage(startIndex, targetIndex) {
    this.sortItem(this.json.backgroundImages, startIndex, targetIndex);
  }

  sortFilter(startIndex, targetIndex) {
    this.sortItem(this.json.filters, startIndex, targetIndex);
  }

  addFilter(item) {
    this.json.filters.push(item);
    return item;
  }

  makeFilter(type, opt = {}) {
    return Filter.parse({ ...opt, type });
  }

  createFilter(type, opt = {}) {
    return this.addFilter(this.makeFilter(type, opt));
  }

  removeFilter(removeIndex) {
    this.json.filters.splice(removeIndex, 1);
  }

  updateFilter(index, data = {}) {
    this.json.filters[+index].reset(data);
  }

  updateBoxShadow(index, data = {}) {
    this.json.boxShadows[+index].reset(data);
  }

  updateTextShadow(index, data = {}) {
    this.json.textShadows[+index].reset(data);
  }

  addBackdropFilter(item) {
    this.json.backdropFilters.push(item);
    return item;
  }

  setSize(data) {
    this.reset(data);
  }

  // 현재 선택된 border 의 속성을 지정한다.
  // type 에 따라 다른데
  // type is all 일 때, 나머지 속성 필드 값은 모두 지운다.
  // type is not all 일 때는 해당 속성만 설정하고 all 값이 존재하면 지운다.
  setBorder(type, data = undefined) {
    var border = this.json.border;
    if (type === "all") {
      if (data) {
        this.json.border = { all: data };
      } else {
        ["top", "right", "bottom", "left"].forEach(type => {
          delete this.json.border[type];
        });
      }
    } else {
      if (border.all && isUndefined(data)) {
        var newObject = { ...border.all };
        border.top = { ...newObject };
        border.bottom = { ...newObject };
        border.left = { ...newObject };
        border.right = { ...newObject };
      }

      if (border.all) {
        delete border.all;
      }

      if (data) {
        this.json.border[type] = data;
      }
    }
  }

  setBorderRadius(type, data) {
    this.json.borderRadius = data;
  }

  traverse(item, results, hasLayoutItem) {
    // var parentItemType = item.parent().itemType;
    if (item.isAttribute()) return;
    // if (parentItemType == 'layer') return;
    if (!hasLayoutItem && item.isLayoutItem() && !item.isRootItem()) return;

    results.push(item);

    item.children.forEach(child => {
      this.traverse(child, results);
    });
  }

  tree(hasLayoutItem) {
    var results = [];

    this.children.forEach(item => {
      this.traverse(item, results, hasLayoutItem);
    });

    return results;
  }

  toPropertyCSS(list, isExport = false) {
    var results = {};
    list.forEach(item => {
      keyEach(item.toCSS(isExport), (key, value) => {
        if (!results[key]) results[key] = [];
        results[key].push(value);
      });
    });

    return combineKeyArray(results);
  }

  toBackgroundImageCSS(isExport = false) {
    return this.toPropertyCSS(this.backgroundImages, isExport);
  }

  getBorderString(data) {
    return `${data.width} ${data.style} ${data.color}`;
  }

  toSizeCSS() {
    return {
      width: this.json.width,
      height: this.json.height
    };
  }

  toBorderCSS() {
    var results = {};
    var border = this.json.border;

    if (border.all) {
      results = {
        border: this.getBorderString(border.all)
      };
    } else {
      keyEach(border, (type, data) => {
        results[`border-${type}`] = this.getBorderString(data);
      });
    }

    return results;
  }

  // 0 데이타는 화면에 표시하지 않는다.
  toBorderRadiusCSS() {
    var results = {};
    var borderRadius = this.json.borderRadius;

    if (borderRadius.all) {
      if (borderRadius.all.value === 0) {
        // noop
      } else {
        results = {
          "border-radius": borderRadius.all
        };
      }
    } else {
      keyEach(borderRadius, (type, data) => {
        if (data.value === 0) {
          // noop
        } else {
          results[`border-${borderRadiusCssKey[type]}-radius`] = data;
        }
      });
    }

    return results;
  }

  toFilterCSS() {
    return {
      filter: this.json.filters.join(WHITE_STRING)
    };
  }
  toBackdropFilterCSS() {
    return this.toPropertyCSS(this.json.backdropFilters);
  }

  toBoxShadowCSS() {
    return this.toPropertyCSS(this.json.boxShadows);
  }

  toTextShadowCSS() {
    return this.toPropertyCSS(this.json.textShadows);
  }

  toString() {
    return CSS_TO_STRING(this.toCSS());
  }

  toExport() {
    return CSS_TO_STRING(this.toCSS(true));
  }

  toBoxModelCSS() {
    var json = this.json;
    var obj = {};
    if (
      json.marginTop.value === json.marginBottom.value &&
      json.marginLeft.value === json.marginRight.value &&
      json.marginTop.value === json.marginRight.value
    ) {
      obj.margin = json.marginTop;
    } else {
      obj["margin-top"] = json.marginTop;
      obj["margin-bottom"] = json.marginBottom;
      obj["margin-left"] = json.marginLeft;
      obj["margin-right"] = json.marginRight;
    }

    if (
      json.paddingTop.value === json.paddingBottom.value &&
      json.paddingLeft.value === json.paddingRight.value &&
      json.paddingTop.value === json.paddingRight.value
    ) {
      obj.padding = json.paddingTop;
    } else {
      obj["padding-top"] = json.paddingTop;
      obj["padding-bottom"] = json.paddingBottom;
      obj["padding-left"] = json.paddingLeft;
      obj["padding-right"] = json.paddingRight;
    }

    return obj;
  }

  toFontCSS() {
    var font = this.json.font;
    var obj = {};

    fontStyleList.forEach(key => {
      if (font[key]) {
        var styleKey = `font-${key}`;
        if (key === "lineHeight") {
          styleKey = "line-height";
        }

        obj[styleKey] = font[key];
      }
    });

    return obj;
  }

  toTextCSS() {
    var text = this.json.text;
    var obj = {};

    textStyleList.forEach(key => {
      if (text[key]) {
        var styleKey = `text-${key}`;

        obj[styleKey] = text[key];
      }
    });

    return obj;
  }

  toSpacingCSS() {
    var spacing = this.json.spacing;
    var obj = {};

    if (spacing.letter) {
      obj["letter-spacing"] = spacing.letter;
    }

    if (spacing.word) {
      obj["word-spacing"] = spacing.word;
    }

    return obj;
  }

  toCSS(isExport = false) {
    var json = this.json;
    var css = {
      "background-color": json.backgroundColor,
      color: json.color,
      content: json.content
    };

    return CSS_SORTING({
      ...css,
      ...this.toFontCSS(),
      ...this.toTextCSS(),
      ...this.toSpacingCSS(),
      ...this.toBoxModelCSS(),
      ...this.toSizeCSS(),
      ...this.toBorderCSS(),
      ...this.toBorderRadiusCSS(),
      ...this.toFilterCSS(),
      ...this.toBackgroundImageCSS(isExport),
      ...this.toBoxShadowCSS(),
      ...this.toTextShadowCSS()
    });
  }

  toEmbedCSS(isExport = false) {
    var json = this.json;
    var css = {
      "background-color": json.backgroundColor,
      color: json.color,
      content: json.content
    };

    return CSS_SORTING({
      ...css,
      ...this.toFontCSS(),
      ...this.toTextCSS(),
      ...this.toSpacingCSS(),
      ...this.toBoxModelCSS(),
      ...this.toSizeCSS(),
      ...this.toBorderCSS(),
      ...this.toBorderRadiusCSS(),
      ...this.toFilterCSS(),
      ...this.toBackgroundImageCSS(isExport),
      ...this.toBoxShadowCSS(),
      ...this.toTextShadowCSS()
    });
  }

  insertLast(source) {
    var sourceParent = source.parent();

    source.parentId = this.id;
    source.index = Number.MAX_SAFE_INTEGER;

    sourceParent.sort();
    this.sort();
  }

  toGridString() {
    return "";
  }
}
