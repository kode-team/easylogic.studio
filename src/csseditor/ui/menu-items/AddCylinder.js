import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddCylinder extends MenuItem {
  getIconString() {
    return icon.cube;
  }
  getTitle() {
    return "5. Cylinder";
  }

  isHideTitle() {
    return true; 
  }  

  clickButton(e) {

    this.emit('add.type', 'cylinder');
  }

}
