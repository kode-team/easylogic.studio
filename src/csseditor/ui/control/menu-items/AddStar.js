import MenuItem from "./MenuItem";
import icon from "../../icon/icon";
 
export default class AddStar extends MenuItem {
  getIconString() {
    return icon.star;
  }
  getTitle() {
    return "Star";
  }


  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    this.emit('hideSubEditor');    
    this.emit('showPolygonEditor', 'star' );

  }
}
