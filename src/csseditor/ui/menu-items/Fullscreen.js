import MenuItem from "./MenuItem";
import icon from "../icon/icon";
import { editor } from "../../../editor/editor";

export default class Fullscreen extends MenuItem {
  getIconString() {
    return icon.fullscreen;
  }
  getTitle() {
    return editor.i18n('menu.item.fullscreen.title');
  }

  clickButton(e) {
    this.emit('toggle.fullscreen')
  }
}
