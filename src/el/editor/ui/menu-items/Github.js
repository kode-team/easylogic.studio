import { registElement } from "el/base/registElement";
import MenuItem from "./MenuItem";

export default class Github extends MenuItem {
  getIcon() {
    return "github";
  }
  getTitle() {
    return this.$i18n('menu.item.github.title');
  }

  clickButton(e) {
    window.open("https://github.com/easylogic/editor", "github-window");
  }
}

registElement({ Github })