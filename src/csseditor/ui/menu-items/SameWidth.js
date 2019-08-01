import MenuItem from "./MenuItem";
import Sort from "../../../editor/Sort";
   
export default class SameWidth extends MenuItem {
  getIcon() {
    return 'width';
  }
  getTitle() {
    return "width";
  }

  clickButton(e) {
    Sort.sameWidth();
    this.emit('refreshSelectionStyleView')
    this.emit('refreshSelectionTool')
  }
}
