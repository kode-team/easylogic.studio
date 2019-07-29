import MenuItem from "./MenuItem";
import icon from "../../icon/icon";
import { editor } from "../../../../editor/editor";
import { EVENT } from "../../../../util/UIElement";
 
export default class AddPath extends MenuItem {
  getIconString() {
    return icon.edit;
  }
  getTitle() {
    return "6. Path";
  }


  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    this.trigger('addPath')
  }

  [EVENT('addPath')] () {
    this.emit('hideSubEditor');
    editor.selection.empty();
    this.emit('initSelectionTool');        
    this.emit('showPathEditor', 'move' );
  }
}
