import { registElement } from "@core/registerElement";
import MenuItem from "./MenuItem";
   
export default class BottomAlign extends MenuItem {
  getIconString() {
    return 'align_vertical_bottom';
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

registElement({ BottomAlign })