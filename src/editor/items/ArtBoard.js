import { DomItem } from "./DomItem";
import { Length } from "../unit/Length";

export class ArtBoard extends DomItem {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "artboard",
      name: "New ArtBoard",
      width: Length.px(1000),
      height: Length.px(1000),
      ...obj
    });
  }

  getArtBoard() {
    return this;
  }

  getDefaultTitle() {
    return "ArtBoard";
  }

  checkInAreaForLayers(area) {
    return this.layers.filter(layer => {
      return layer.checkInArea(area);
    })
  }

}
