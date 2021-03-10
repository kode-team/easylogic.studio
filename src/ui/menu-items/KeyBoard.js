import { registElement } from "@core/registerElement";
import MenuItem from "./MenuItem";

export default class KeyBoard extends MenuItem {
  getIconString() {
    return 'keyboard';
  }

  getTitle() {
    return this.$i18n('menu.item.shortcuts.title');
  }

  clickButton(e) {
    this.emit('showShortcutWindow')
  }
}

registElement({ KeyBoard })
