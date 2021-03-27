import MenuItem from "./MenuItem";
import icon from "@icon/icon";
import { registElement } from "@sapa/registerElement";
   
export default class TopAlign extends MenuItem {
  getIconString() {
    return 'align_vertical_top';
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

registElement({ TopAlign })
