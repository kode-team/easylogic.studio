import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddSVGCircle extends MenuItem {
  getIconString() {
    return icon.circle;
  }
  getTitle() {
    return "6. SVG Circle";
  }
 

  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    this.emit('add.type', 'svgcircle');
  }

}
