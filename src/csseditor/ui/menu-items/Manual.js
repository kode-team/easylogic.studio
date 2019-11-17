import MenuItem from "./MenuItem";
import icon from "../icon/icon";
import { editor } from "../../../editor/editor";

export default class Manual extends MenuItem {
  getIconString() {
    return icon.note;
  }
  getTitle() {
    return editor.i18n('menu.item.learn.title');
  }

  clickButton(e) {
    window.open("https://www.easylogic.studio/docs/getting-started.html", "learn-window");
  }
}
