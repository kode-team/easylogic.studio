import { MovableItem } from "./MovableItem";
import { NEW_LINE_2 } from "../../util/css/types";
import { uuidShort } from "../../util/functions/math";

export class Project extends MovableItem {
  getDefaultTitle() {
    return "New Project";
  }

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "project",
      name: 'Project ' + uuidShort(),
      ...obj,
      children: []
    });
  }

  get artboards () {
    return this.json.layers || [];
  }

  get html () {
    return this.artboards.map(it => it.html).join(NEW_LINE_2);
  }
}
