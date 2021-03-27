import { registElement } from "@sapa/registerElement";
import MenuItem from "./MenuItem";
   
export default class CenterAlign extends MenuItem {
  getIconString() {
    return 'align_horizontal_center';
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

registElement({ CenterAlign })