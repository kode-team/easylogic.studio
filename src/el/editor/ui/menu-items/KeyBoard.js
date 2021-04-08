import { registElement } from "el/base/registerElement";
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

  isHideTitle() {
    return true; 
  }
}

registElement({ KeyBoard })
