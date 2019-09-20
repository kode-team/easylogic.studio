import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddCube extends MenuItem {
  getIconString() {
    return icon.cube;
  }
  getTitle() {
    return "5. Cube";
  }

  isHideTitle() {
    return true; 
  }  

  clickButton(e) {

    this.emit('add.type', 'cube');
  }

}
