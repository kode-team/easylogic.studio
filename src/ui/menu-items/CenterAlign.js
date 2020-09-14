import MenuItem from "./MenuItem";
import icon from "@icon/icon";
   
export default class CenterAlign extends MenuItem {
  getIconString() {
    return icon.center;
  }
  getTitle() {
    return "Center";
  }
 
  isHideTitle () {
    return true; 
  } 

  clickButton(e) {
    this.emit('sort.center');
  }
}
