import MenuItem from "./MenuItem";
import icon from "../../icon/icon";
import { EVENT } from "../../../../util/UIElement";
 
export default class ToggleRightItem extends MenuItem {
  getIconString() {
    return icon.dahaze;
  }

  getIcon() {
    return 'open-right-panel'
  }

  getTitle() { 
    return "Property";
  }

  clickButton(e) {
    this.emit('toggleRightPanel');
    this.trigger('refreshMenuItem');
  }

  [EVENT('refreshMenuItem')] () {
    this.$el.toggleClass('open', editor.openRightPanel);
  }

  [EVENT('refreshAll')] () {
    this.trigger('refreshMenuItem')
  }
}
