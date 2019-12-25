import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddPath extends MenuItem {
  getIconString() {
    return icon.edit;
  }
  getTitle() {
    return this.props.title || "Path";
  }


  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    this.emit('add.path')
  }

}
