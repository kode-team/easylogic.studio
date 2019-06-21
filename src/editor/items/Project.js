import { MovableItem } from "./MovableItem";
import { NEW_LINE_2 } from "../../util/css/types";

export class Project extends MovableItem {
  getDefaultTitle() {
    return "New Project";
  }

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "project",
      ...obj,
      children: []
    });
  }

  get html () {
    return this.json.layers.map(it => it.html).join(NEW_LINE_2);
  }
}
