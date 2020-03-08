import MenuItem from "./MenuItem";
import Sort from "../../../editor/Sort";
import icon from "../icon/icon";
   
export default class RightAlign extends MenuItem {
  getIconString() {
    return icon.right;
  }
  getTitle() {
    return "Right";
  }

  isHideTitle () {
    return true; 
  }  

  clickButton(e) {
    Sort.right(this.$editor);
    this.emit('refreshSelectionStyleView')
    this.emit('refreshSelectionTool')
  }
}
