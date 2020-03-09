import MenuItem from "./MenuItem";
import icon from "../icon/icon";

export default class ExportView extends MenuItem {
  getIconString() {
    return icon.publish;
  }
  getTitle() {
    return this.$i18n('menu.item.export.title');
  }

  clickButton(e) {
    this.emit('showExportView')
  }
}
