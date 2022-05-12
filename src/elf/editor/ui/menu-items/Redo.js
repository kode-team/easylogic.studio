import MenuItem from "./MenuItem";

export default class Redo extends MenuItem {
  getIconString() {
    return "redo";
  }
  getTitle() {
    return "Redo";
  }

  isHideTitle() {
    return true;
  }

  clickButton() {
    this.$commands.emit("history.redo");
  }
}
