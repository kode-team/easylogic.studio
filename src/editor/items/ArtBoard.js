import { EMPTY_STRING } from "../../util/css/types";
import { CSS_TO_STRING, CSS_SORTING } from "../../util/css/make";
import { Length } from "../unit/Length";
import { Display } from "../css-property/Display";
import { GroupItem } from "./GroupItem";
import { Filter } from "../css-property/Filter";
import { BackdropFilter } from "../css-property/BackdropFilter";
import { BackgroundImage } from "../css-property/BackgroundImage";
import { keyEach, combineKeyArray } from "../../util/functions/func";

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

  sortBackgroundImage(startIndex, targetIndex) {
    console.log(startIndex, targetIndex);
    var results = [];
    var images = this.json.backgroundImages;
    images.forEach((it, index) => {
      if (targetIndex === index) {
        results.push(images[startIndex]);
        results.push(images[targetIndex]);
      } else if (startIndex === index) {
        // noop
      } else {
        results.push(images[index]);
      }
    });
    this.json.backgroundImages = results;
  }

  addFilter(item) {
    this.json.filters.push(item);
    return item;
  }

  addBackdropFilter(item) {
    this.json.backdropFilters.push(item);
    return item;
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

  toFilterCSS() {
    return this.toPropertyCSS(this.filters);
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
