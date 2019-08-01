import MenuItem from "./MenuItem";
import icon from "../../icon/icon";

export default class ExportView extends MenuItem {
  getIconString() {
    return icon.publish;
  }
  getTitle() {
    return "Export";
  }

  clickButton(e) {
    this.emit('show.exportView')
  }
}
