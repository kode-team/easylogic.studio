import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddCylinder extends MenuItem {
  getIconString() {
    return icon.cylinder;
  }
  getTitle() {
    return "5. Cylinder";
  }

  getClassName() {
    return 'cylinder'
  }

  isHideTitle() {
    return true; 
  }  

  clickButton(e) {

    this.emit('add.type', 'cylinder');
  }

}
