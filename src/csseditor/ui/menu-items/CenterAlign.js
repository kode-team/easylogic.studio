import MenuItem from "./MenuItem";
import Sort from "../../../editor/Sort";
import icon from "../icon/icon";
   
export default class CenterAlign extends MenuItem {
  getIconString() {
    return icon.center;
  }
  getTitle() {
    return "Center";
  }
 
  isHideTitle () {
    return true; 
  } 

  clickButton(e) {
    // Sort 도 다 커맨드 형태로 바꿔야함. 
    Sort.center(this.$editor);
    this.emit('refreshSelectionStyleView')
    this.emit('refreshSelectionTool')
  }
}
