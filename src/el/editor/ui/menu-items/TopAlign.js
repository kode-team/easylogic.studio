import MenuItem from "./MenuItem";
import icon from "el/editor/icon/icon";
import { registElement } from "el/base/registElement";
   
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
