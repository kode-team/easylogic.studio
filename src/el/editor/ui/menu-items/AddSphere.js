import { registElement } from "el/base/registElement";
import MenuItem from "./MenuItem";
 
export default class AddSphere extends MenuItem {
  getIconString() {
    return 'add_circle';
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

registElement({ AddSphere })