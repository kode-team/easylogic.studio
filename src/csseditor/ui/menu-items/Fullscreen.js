import MenuItem from "./MenuItem";
import icon from "../icon/icon";

export default class Fullscreen extends MenuItem {
  getIconString() {
    return icon.fullscreen;
  }
  getTitle() {
    return "Screen";
  }

  clickButton(e) {
    this.emit('toggle.fullscreen')
  }
}
