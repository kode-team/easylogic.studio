import { registElement } from "@core/registerElement";
import MenuItem from "./MenuItem";
   
export default class LeftAlign extends MenuItem {
  getIconString() {
    return 'align_horizontal_left';
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

registElement({ LeftAlign })