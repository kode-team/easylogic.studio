import MenuItem from "./MenuItem";

export default class LeftAlign extends MenuItem {
  getIconString() {
    return "align_horizontal_left";
  }
  getTitle() {
    return "Left";
  }

  isHideTitle() {
    return true;
  }

  clickButton() {
    this.$commands.emit("sort.left");
  }
}
