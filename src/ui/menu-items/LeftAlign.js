import MenuItem from "./MenuItem";
import icon from "@icon/icon";
   
export default class LeftAlign extends MenuItem {
  getIconString() {
    return icon.align_horizontal_left;
  }
  getTitle() {
    return "Left";
  }

  isHideTitle () {
    return true; 
  }  

  clickButton(e) {
    this.emit('sort.left');
  }
}
