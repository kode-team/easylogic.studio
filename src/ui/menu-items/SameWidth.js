import MenuItem from "./MenuItem";
import icon from "@icon/icon";
   
export default class SameWidth extends MenuItem {
  getIconString() {
    return icon.same_width;
  }
  getTitle() {
    return "width";
  }

  isHideTitle () {
    return true; 
  }

  clickButton(e) {
    this.emit('same.width');
  }
}
