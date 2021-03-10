import { registElement } from "@core/registerElement";
import MenuItem from "./MenuItem";
   
export default class SameWidth extends MenuItem {
  getIconString() {
    return 'horizontal_distribute';
  }
  getTitle() {
    return "width";
  }

  isHideTitle () {
    return true; 
  }

  isDisabled () {
    return true; 
  }  

  clickButton(e) {
    this.emit('same.width');
  }
}

registElement({ SameWidth })