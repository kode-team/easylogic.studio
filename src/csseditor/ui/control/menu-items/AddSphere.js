import MenuItem from "./MenuItem";
import icon from "../../icon/icon";
 
export default class AddSphere extends MenuItem {
  getIcon() {
    return 'circle';
  }
  getTitle() {
    return "6. Sphere";
  }

  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
   this.emit('add.sphere')
  }

}
