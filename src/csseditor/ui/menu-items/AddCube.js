import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddCube extends MenuItem {
  getIconString() {
    return icon.cube;
  }
  getTitle() {
    return this.props.title || "Cube";
  }

  isHideTitle() {
    return true; 
  }  

  clickButton(e) {

    this.emit('addLayerView', 'cube');
  }

}
