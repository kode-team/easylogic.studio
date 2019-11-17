import MenuItem from "./MenuItem";
import { editor } from "../../../editor/editor";

export default class Github extends MenuItem {
  getIcon() {
    return "github";
  }
  getTitle() {
    return editor.i18n('menu.item.github.title');
  }

  clickButton(e) {
    window.open("https://github.com/easylogic/editor", "github-window");
  }
}
