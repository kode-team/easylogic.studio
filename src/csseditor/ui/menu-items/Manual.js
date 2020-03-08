import MenuItem from "./MenuItem";
import icon from "../icon/icon";

export default class Manual extends MenuItem {
  getIconString() {
    return icon.note;
  }
  getTitle() {
    return this.$i18n('menu.item.learn.title');
  }

  clickButton(e) {
    window.open("https://www.easylogic.studio/docs/getting-started.html", "learn-window");
  }
}
