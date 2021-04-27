import MenuItem from "./MenuItem";
import icon from "el/editor/icon/icon";
import { registElement } from "el/base/registElement";

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

  isHideTitle() {
    return true;
  }
}

registElement({ Save })