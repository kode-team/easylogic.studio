import MenuItem from "./MenuItem";
import Sort from "../../../editor/Sort";
import icon from "../icon/icon";
   
export default class TopAlign extends MenuItem {
  getIconString() {
    return icon.top;
  }
  getTitle() {
    return "Top";
  }

  isHideTitle () {
    return true; 
  }  

  clickButton(e) {
    Sort.top(this.$editor);
    this.emit('refreshSelectionStyleView')
    this.emit('refreshSelectionTool')
  }
}
