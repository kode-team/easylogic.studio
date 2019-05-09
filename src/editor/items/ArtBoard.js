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

export class ArtBoard extends GroupItem {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "artboard",
      width: Length.px(300),
      height: Length.px(400),
      backgroundColor: "white",
      name: "New ArtBoard",
      x: Length.px(100),
      y: Length.px(100),
      filters: [],
      border: {},
      borderRadius: {},
      backdropFilters: [],
      backgroundImages: [],
      perspectiveOriginPositionX: Length.percent(0),
      perspectiveOriginPositionY: Length.percent(0),
      display: Display.parse({ display: "block" }),
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
    return this.toPropertyCSS(this.backdropFilters);
  }

  toString() {
    return CSS_TO_STRING(this.toCSS());
  }

  toExport() {
    return CSS_TO_STRING(this.toCSS(true));
  }

  toCSS(isExport = false) {
    var json = this.json;
    var css = {
      "background-color": json.backgroundColor
    };

    return CSS_SORTING({
      ...css,
      ...this.toSizeCSS(),
      ...this.toBorderCSS(),
      ...this.toBorderRadiusCSS(),
      ...this.toFilterCSS(),
      ...this.toBackgroundImageCSS(isExport)
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
