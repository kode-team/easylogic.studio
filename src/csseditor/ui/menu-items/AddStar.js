import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddStar extends MenuItem {
  getIconString() {
    return icon.star;
  }
  getTitle() {
    return this.props.title || "Star";
  }

  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    this.emit('hideSubEditor');    
    this.$selection.empty();
    this.emit('initSelectionTool');    
    this.emit('showPolygonEditor', 'star' );
  }
}
