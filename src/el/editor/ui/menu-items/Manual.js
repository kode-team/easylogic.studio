import { registElement } from "el/base/registElement";
import MenuItem from "./MenuItem";

export default class Manual extends MenuItem {
  getIconString() {
    return 'note';
  }
  getTitle() {
    return this.$i18n('menu.item.learn.title');
  }

  clickButton(e) {
    window.open("https://www.easylogic.studio/docs/getting-started.html", "learn-window");
  }
}

registElement({ Manual })