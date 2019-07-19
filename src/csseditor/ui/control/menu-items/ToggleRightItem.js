import MenuItem from "./MenuItem";
import { editor } from "../../../../editor/editor";
import { TextLayer } from "../../../../editor/items/layers/TextLayer";
import icon from "../../icon/icon";
import { Length } from "../../../../editor/unit/Length";
 
export default class ToggleRightItem extends MenuItem {
  getIconString() {
    return icon.dahaze;
  }
  getTitle() { 
    return "Panel";
  }

  clickButton(e) {
    this.emit('toggleRightPanel');
  }
}
