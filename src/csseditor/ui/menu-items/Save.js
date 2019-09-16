import MenuItem from "./MenuItem";
import icon from "../icon/icon";

export default class Save extends MenuItem {
  getIconString() {
    return icon.file_copy;
  }
  getTitle() {
    return "Save";
  }

  clickButton(e) {
    this.emit('save.json')
  }
}
