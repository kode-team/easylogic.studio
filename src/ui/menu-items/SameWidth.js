import MenuItem from "./MenuItem";
import icon from "@icon/icon";
   
export default class SameWidth extends MenuItem {
  getIconString() {
    return icon.horizontal_distribute;
  }
  getTitle() {
    return "width";
  }

  isHideTitle () {
    return true; 
  }

  isDisabled () {
    return true; 
  }  

  clickButton(e) {
    this.emit('same.width');
  }
}
