import MenuItem from "./MenuItem";
import icon from "../icon/icon";
import { editor } from "../../../editor/editor";

export default class Save extends MenuItem {
  getIconString() {
    return icon.storage;
  }
  getTitle() {
    return editor.i18n('menu.item.save.title');
  }

  clickButton(e) {
    this.emit('save.json')
  }
}
