import { registElement } from "@sapa/registerElement";
import MenuItem from "./MenuItem";
   
export default class RightAlign extends MenuItem {
  getIconString() {
    return 'align_horizontal_right';
  }
  getTitle() {
    return "Right";
  }

  isHideTitle () {
    return true; 
  }  

  clickButton(e) {
    this.emit('sort.right');
  }
}

registElement({ RightAlign })
