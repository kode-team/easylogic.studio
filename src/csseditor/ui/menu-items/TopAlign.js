import MenuItem from "./MenuItem";
import Sort from "../../../editor/Sort";
   
export default class TopAlign extends MenuItem {
  getIcon() {
    return 'top';
  }
  getTitle() {
    return "Top";
  }

  isHideTitle () {
    return true; 
  }  

  clickButton(e) {
    Sort.top();
    this.emit('refreshSelectionStyleView')
    this.emit('refreshSelectionTool')
  }
}
