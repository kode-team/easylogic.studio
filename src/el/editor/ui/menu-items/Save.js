import MenuItem from "./MenuItem";
import icon from "el/editor/icon/icon";
import { registElement } from "el/base/registerElement";

export default class Save extends MenuItem {
  getIconString() {
    return 'storage';
  }
  getTitle() {
    return this.$i18n('menu.item.save.title');
  }

  clickButton(e) {
    this.emit('saveJSON')
  }
}

registElement({ Save })