import MenuItem from "./MenuItem";
import icon from "../icon/icon";

export default class Fullscreen extends MenuItem {
  getIconString() {
    return icon.fullscreen;
  }
  getTitle() {
    return this.$i18n('menu.item.fullscreen.title');
  }

  clickButton(e) {
    this.emit('toggle.fullscreen')
  }
}
