import MenuItem from "./MenuItem";

export default class CenterAlign extends MenuItem {
  getIconString() {
    return "align_horizontal_center";
  }
  getTitle() {
    return "Center";
  }

  isHideTitle() {
    return true;
  }

  clickButton() {
    this.$commands.emit("sort.center");
  }
}
