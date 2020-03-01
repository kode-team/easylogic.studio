import MenuItem from "./MenuItem";
import Sort from "../../../editor/Sort";
import icon from "../icon/icon";
   
export default class BottomAlign extends MenuItem {
  getIconString() {
    return icon.bottom;
  }
  getTitle() {
    return "Bottom";
  }

  isHideTitle () {
    return true; 
  }  

  clickButton(e) {
    //FIXME: 여기는 command 로 어떻게 만들지, 최종은 reset 이긴 한데 
    // 중간 로직을 여기다 둬야 하는게 맞는 것인가? 
    Sort.bottom();
    this.emit('refreshSelectionStyleView')
    this.emit('refreshSelectionTool')
  }
}
