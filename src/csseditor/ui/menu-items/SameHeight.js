import MenuItem from "./MenuItem";
import Sort from "../../../editor/Sort";
   
export default class SameHeight extends MenuItem {
  getIcon() {
    return 'height';
  }
  getTitle() {
    return "height";
  }

  isHideTitle () {
    return true; 
  }
  clickButton(e) {
    Sort.sameHeight();
    this.emit('refreshSelectionStyleView')
    this.emit('refreshSelectionTool')
  }
}
