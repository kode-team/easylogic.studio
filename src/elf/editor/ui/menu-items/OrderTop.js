import MenuItem from "./MenuItem";

export default class OrderTop extends MenuItem {
  getIconString() {
    return "to_front";
  }

  getTitle() {
    return "To Front";
  }

  clickButton() {
    this.commands.executeCommand(
      "bring.forward",
      "bring forward",
      this.$context.selection.current
    );
  }
}
