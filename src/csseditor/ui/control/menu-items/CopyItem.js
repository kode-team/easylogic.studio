import MenuItem from "./MenuItem";
import { editor } from "../../../../editor/editor";
import { EVENT } from "../../../../util/UIElement";
 
export default class CopyItem extends MenuItem {
  getIcon() {
    return 'copy';
  }
  getTitle() {
    return "Copy";
  }

  clickButton(e) {

      editor.selection.copy();

      this.emit('refreshAll')
      this.emit('refreshSelection');
  }

  [EVENT('refreshSelection')] () {
    this.$el.hide();
  }
}
