import MenuItem from "./MenuItem";
import Sort from "../../../editor/Sort";
import icon from "../icon/icon";
   
export default class BottomAlign extends MenuItem {
  getIconString() {
    return icon.bottom;
  }
  getTitle() {
    return "Bottom";
  }

  isHideTitle () {
    return true; 
  }  

  clickButton(e) {
    Sort.bottom();
    this.emit('refreshSelectionStyleView')
    this.emit('refreshSelectionTool')
  }
}
