import MenuItem from "./MenuItem";
import icon from "../icon/icon";

export default class Download extends MenuItem {
  getIconString() {
    return icon.archive;
  }
  getTitle() {
    return this.$i18n('menu.item.download.title');
  }

  clickButton(e) {
    this.emit('downloadJSON')
  }
}
