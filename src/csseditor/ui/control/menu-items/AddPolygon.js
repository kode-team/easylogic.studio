import MenuItem from "./MenuItem";
import icon from "../../icon/icon";
import { editor } from "../../../../editor/editor";
 
export default class AddPolygon extends MenuItem {
  getIconString() {
    return icon.polygon;
  }
  getTitle() {
    return "Polygon";
  }


  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    this.emit('hideSubEditor');    
    editor.selection.empty();
    this.emit('initSelectionTool');
    this.emit('showPolygonEditor', 'move' );
  }
}
