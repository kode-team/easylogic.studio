import MenuItem from "./MenuItem";
import icon from "../icon/icon";

export default class KeyBoard extends MenuItem {
  getIconString() {
    return icon.keyboard;
  }

  getTitle() {
    return this.$i18n('menu.item.shortcuts.title');
  }

  clickButton(e) {
    this.emit('showShortcutWindow')
  }
}
