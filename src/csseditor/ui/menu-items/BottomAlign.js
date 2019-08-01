import MenuItem from "./MenuItem";
import Sort from "../../../editor/Sort";
   
export default class BottomAlign extends MenuItem {
  getIcon() {
    return 'bottom';
  }
  getTitle() {
    return "Bottom";
  }

  clickButton(e) {
    Sort.bottom();
    this.emit('refreshSelectionStyleView')
    this.emit('refreshSelectionTool')
  }
}
