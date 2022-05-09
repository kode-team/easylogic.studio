import MenuItem from "./MenuItem";

export default class MiddleAlign extends MenuItem {
  getIconString() {
    return "align_vertical_center";
  }
  getTitle() {
    return "middle";
  }

  isHideTitle() {
    return true;
  }

  clickButton() {
    this.$commands.emit("sort.middle");
  }
}
