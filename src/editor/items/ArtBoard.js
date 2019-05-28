import { DomItem } from "./DomItem";

export class ArtBoard extends DomItem {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "artboard",
      name: "New ArtBoard",
      ...obj
    });
  }

  getArtBoard() {
    return this;
  }

  convert(json) {
    json = super.convert(json);

    //TODO: implement artboard property 

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

  // get filters() {
  //   return this.json.filters;
  // }
  // get backdropFilters() {
  //   return this.json.backdropFilters;
  // }
  // get backgroundImages() {
  //   return this.json.backgroundImages || [];
  // }

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
