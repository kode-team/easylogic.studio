import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddSVGTextPath extends MenuItem {
  getIconString() {
    return icon.text_rotate;
  }
  getTitle() {
    return "10. SVG TextPath";
  }
 

  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    this.emit('add.type', 'svgtextpath');
  }

}
