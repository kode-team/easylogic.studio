import MenuItem from "./MenuItem";
import Sort from "../../../editor/Sort";
import icon from "../icon/icon";
   
export default class SameWidth extends MenuItem {
  getIconString() {
    return icon.same_width;
  }
  getTitle() {
    return "width";
  }

  isHideTitle () {
    return true; 
  }

  clickButton(e) {
    Sort.sameWidth(this.$editor);
    this.emit('refreshSelectionStyleView')
    this.emit('refreshSelectionTool')
  }
}
