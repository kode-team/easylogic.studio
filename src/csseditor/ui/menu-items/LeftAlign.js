import MenuItem from "./MenuItem";
import Sort from "../../../editor/Sort";
import icon from "../icon/icon";
   
export default class LeftAlign extends MenuItem {
  getIconString() {
    return icon.left;
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
