import MenuItem from "./MenuItem";
import icon from "../icon/icon";
import { editor } from "../../../editor/editor";

export default class ExportView extends MenuItem {
  getIconString() {
    return icon.publish;
  }
  getTitle() {
    return editor.i18n('menu.item.export.title');
  }

  clickButton(e) {
    this.emit('show.exportView')
  }
}
