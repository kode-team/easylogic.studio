import MenuItem from "./MenuItem";
import icon from "@icon/icon";
   
export default class MiddleAlign extends MenuItem {
  getIconString() {
    return icon.align_vertical_center;
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
