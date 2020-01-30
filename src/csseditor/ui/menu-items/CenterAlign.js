import MenuItem from "./MenuItem";
import Sort from "../../../editor/Sort";
import icon from "../icon/icon";
   
export default class CenterAlign extends MenuItem {
  getIconString() {
    return icon.center;
  }
  getTitle() {
    return "Center";
  }
 
  isHideTitle () {
    return true; 
  } 

  clickButton(e) {
    Sort.center();
    this.emit('refreshSelectionStyleView')
    this.emit('refreshSelectionTool')
  }
}
