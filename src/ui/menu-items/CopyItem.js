import MenuItem from "./MenuItem";
import { EVENT } from "@core/UIElement";
 
export default class CopyItem extends MenuItem {
  getIcon() {
    return 'copy';
  }
  getTitle() {
    return "Copy";
  }

  clickButton(e) {

      this.$selection.copy();

      this.emit('refreshAll')
      this.emit('refreshSelection');
  }

  [EVENT('refreshSelection')] () {
    this.$el.hide();
  }
}
