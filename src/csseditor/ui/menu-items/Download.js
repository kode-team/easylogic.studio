import MenuItem from "./MenuItem";
import icon from "../icon/icon";
import { editor } from "../../../editor/editor";

export default class Download extends MenuItem {
  getIconString() {
    return icon.archive;
  }
  getTitle() {
    return editor.i18n('menu.item.download.title');
  }

  clickButton(e) {
    this.emit('download.json')
  }
}
