import MenuItem from "./MenuItem";

export default class Projects extends MenuItem {
  getIconString() {
    return "note";
  }
  getTitle() {
    return this.$i18n("menu.item.projects.title");
  }

  isHideTitle() {
    return true;
  }

  clickButton() {
    this.emit("open.projects");
  }
}
