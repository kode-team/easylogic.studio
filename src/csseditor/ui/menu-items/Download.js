import MenuItem from "./MenuItem";
import icon from "../icon/icon";

export default class Download extends MenuItem {
  getIconString() {
    return icon.save;
  }
  getTitle() {
    return "Download";
  }

  clickButton(e) {
    this.emit('download.json')
  }
}
