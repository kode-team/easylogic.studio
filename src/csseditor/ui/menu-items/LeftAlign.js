import MenuItem from "./MenuItem";
import Sort from "../../../editor/Sort";
   
export default class LeftAlign extends MenuItem {
  getIcon() {
    return 'left';
  }
  getTitle() {
    return "Left";
  }

  isHideTitle () {
    return true; 
  }  

  clickButton(e) {
    Sort.left();
    this.emit('refreshSelectionStyleView')
    this.emit('refreshSelectionTool')
  }
}
