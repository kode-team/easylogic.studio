import { registElement } from "el/base/registerElement";
import MenuItem from "./MenuItem";

export default class ExportView extends MenuItem {
  getIconString() {
    return 'launch';
  }
  getTitle() {
    return this.$i18n('menu.item.export.title');
  }

  clickButton(e) {
    this.emit('showExportView')
  }

  isHideTitle() {
    return true;
  }

}

registElement({ ExportView })
