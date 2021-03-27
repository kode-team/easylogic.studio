import { registElement } from "@sapa/registerElement";
import MenuItem from "./MenuItem";
   
export default class SameHeight extends MenuItem {
  getIconString() {
    return 'vertical_distribute';
  }

  getTitle() {
    return "height";
  }

  isHideTitle () {
    return true; 
  }

  isDisabled () {
    return true; 
  }

  clickButton(e) {
    this.emit('same.height');
  }
}

registElement({ SameHeight })
