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

  getDefaultTitle() {
    return "ArtBoard";
  }


}
