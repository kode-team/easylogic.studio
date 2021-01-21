import MenuItem from "./MenuItem";
import icon from "@icon/icon";
   
export default class SameHeight extends MenuItem {
  getIconString() {
    return icon.vertical_distribute;
  }

  getTitle() {
    return "height";
  }

  isHideTitle () {
    return true; 
  }

  isDisabled () {
    return true; 
  }

  clickButton(e) {
    this.emit('same.height');
  }
}
