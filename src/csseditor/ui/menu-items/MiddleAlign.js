import MenuItem from "./MenuItem";
import Sort from "../../../editor/Sort";
import icon from "../icon/icon";
   
export default class MiddleAlign extends MenuItem {
  getIconString() {
    return icon.middle;
  }
  getTitle() {
    return "middle";
  }

  isHideTitle () {
    return true; 
  }

  clickButton(e) {
    Sort.middle(this.$editor);
    this.emit('refreshSelectionStyleView')
    this.emit('refreshSelectionTool')
  }
}
