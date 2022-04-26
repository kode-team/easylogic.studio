import MenuItem from "./MenuItem";

export default class KeyBoard extends MenuItem {
  getIconString() {
    return "keyboard";
  }

  getTitle() {
    return this.$i18n("menu.item.shortcuts.title");
  }

  clickButton() {
    this.emit("showShortcutWindow");
  }

  isHideTitle() {
    return true;
  }
}
