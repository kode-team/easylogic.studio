import MenuItem from "./MenuItem";

export default class SameHeight extends MenuItem {
  getIconString() {
    return "vertical_distribute";
  }

  getTitle() {
    return "height";
  }

  isHideTitle() {
    return true;
  }

  clickButton() {
    this.$commands.emit("same.height");
  }
}
