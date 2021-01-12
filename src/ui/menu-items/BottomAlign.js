import MenuItem from "./MenuItem";
import icon from "@icon/icon";
   
export default class BottomAlign extends MenuItem {
  getIconString() {
    return icon.align_vertical_bottom;
  }
  getTitle() {
    return "Bottom";
  }

  isHideTitle () {
    return true; 
  }  

  clickButton(e) {
    this.emit('sort.bottom');
  }
}
