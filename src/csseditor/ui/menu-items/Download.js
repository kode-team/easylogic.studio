import MenuItem from "./MenuItem";
import icon from "../icon/icon";

export default class Download extends MenuItem {
  getIconString() {
    return icon.archive;
  }
  getTitle() {
    return "Archive";
  }

  clickButton(e) {
    this.emit('download.json')
  }
}
