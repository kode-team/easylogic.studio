import MenuItem from "./MenuItem";
import Sort from "../../../../editor/Sort";
   
export default class RightAlign extends MenuItem {
  getIcon() {
    return 'right';
  }
  getTitle() {
    return "Right";
  }

  clickButton(e) {
    Sort.right();
    this.emit('refreshSelectionStyleView')
    this.emit('refreshSelectionTool')
  }
}
