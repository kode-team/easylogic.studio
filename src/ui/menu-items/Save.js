import MenuItem from "./MenuItem";
import icon from "@icon/icon";

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
