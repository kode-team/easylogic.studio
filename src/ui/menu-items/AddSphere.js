import MenuItem from "./MenuItem";
import icon from "@icon/icon";
 
export default class AddSphere extends MenuItem {
  getIconString() {
    return icon.add_circle;
  }
  getTitle() {
    return "6. Sphere";
  }

  isHideTitle() {
    return true; 
  }  

  clickButton(e) {

    this.emit('addComponentType', 'sphere');
  }

}
