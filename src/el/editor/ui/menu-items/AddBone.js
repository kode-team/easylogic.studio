import { registElement } from "el/sapa/functions/registElement";
import MenuItem from "./MenuItem";
 
export default class AddBone extends MenuItem {
  getIconString() {
    return 'rect';
  }
  getTitle() {
    return "1. Bone";
  }


  isHideTitle() {
    return true; 
  }  

  clickButton(e) {

    this.emit('addComponentType', 'bone');
  }
}

registElement({ AddBone })
