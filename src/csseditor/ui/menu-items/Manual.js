import MenuItem from "./MenuItem";
import icon from "../icon/icon";

export default class Manual extends MenuItem {
  getIconString() {
    return icon.note;
  }
  getTitle() {
    return "Learn";
  }

  clickButton(e) {
    window.open("https://www.easylogic.studio/docs/getting-started.html", "learn-window");
  }
}
