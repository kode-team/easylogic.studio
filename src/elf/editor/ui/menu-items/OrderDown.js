import MenuItem from "./MenuItem";

export default class OrderDown extends MenuItem {
  getIconString() {
    return "to_back";
  }

  getTitle() {
    return "To Back";
  }

  clickButton() {
    this.command("send.backward", "send backward", this.$selection.current);
  }
}
