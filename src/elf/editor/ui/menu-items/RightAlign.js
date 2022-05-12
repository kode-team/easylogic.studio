import MenuItem from "./MenuItem";

export default class RightAlign extends MenuItem {
  getIconString() {
    return "align_horizontal_right";
  }
  getTitle() {
    return "Right";
  }

  isHideTitle() {
    return true;
  }

  clickButton() {
    this.$commands.emit("sort.right");
  }
}
