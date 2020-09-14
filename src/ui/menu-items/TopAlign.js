import MenuItem from "./MenuItem";
import icon from "@icon/icon";
   
export default class TopAlign extends MenuItem {
  getIconString() {
    return icon.top;
  }
  getTitle() {
    return "Top";
  }

  isHideTitle () {
    return true; 
  }  

  clickButton(e) {
    this.emit('sort.top');
  }
}
