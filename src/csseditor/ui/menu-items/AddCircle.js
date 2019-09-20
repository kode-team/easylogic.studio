import MenuItem from "./MenuItem";
import icon from "../icon/icon";
   
export default class AddCircle extends MenuItem {
  getIconString() {
    return icon.circle
  }
  getTitle() {
    return "2. Circle";
  }


  isHideTitle() {
    return true; 
  }  

  clickButton(e) {

    this.emit('add.type', 'circle');    

  }

}
