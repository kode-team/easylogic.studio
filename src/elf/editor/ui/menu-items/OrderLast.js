import MenuItem from "./MenuItem";

export default class OrderLast extends MenuItem {
  getIconString() {
    return "to_back";
  }

  getTitle() {
    return "To Last";
  }

  clickButton() {
    this.$commands.executeCommand(
      "bring.front",
      "bring front",
      this.$context.selection.current
    );
  }
}
