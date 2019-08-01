import MenuItem from "./MenuItem";
import icon from "../icon/icon";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";
 
export default class AddStar extends MenuItem {
  getIconString() {
    return icon.star;
  }
  getTitle() {
    return "Star";
  }


  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    this.trigger('addStar')
  }

  [EVENT('addStar')] () {
    this.emit('hideSubEditor');    
    editor.selection.empty();
    this.emit('initSelectionTool');    
    this.emit('showPolygonEditor', 'star' );
  }
}
