import MenuItem from "./MenuItem";
import icon from "@icon/icon";
   
export default class MiddleAlign extends MenuItem {
  getIconString() {
    return icon.middle;
  }
  getTitle() {
    return "middle";
  }

  isHideTitle () {
    return true; 
  }

  clickButton(e) {
    this.emit('sort.middle');
  }
}
