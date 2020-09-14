import MenuItem from "./MenuItem";
import icon from "@icon/icon";
 
export default class AddBone extends MenuItem {
  getIconString() {
    return icon.rect;
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
