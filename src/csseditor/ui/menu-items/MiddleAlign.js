import MenuItem from "./MenuItem";
import Sort from "../../../editor/Sort";
   
export default class MiddleAlign extends MenuItem {
  getIcon() {
    return 'middle';
  }
  getTitle() {
    return "middle";
  }

  isHideTitle () {
    return true; 
  }

  clickButton(e) {
    Sort.middle();
    this.emit('refreshSelectionStyleView')
    this.emit('refreshSelectionTool')
  }
}
