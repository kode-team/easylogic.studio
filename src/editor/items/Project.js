import { MovableItem } from "./MovableItem";

export class Project extends MovableItem {
  getDefaultTitle() {
    return "New Project";
  }

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "project",
      ...obj
    });
  }
}
