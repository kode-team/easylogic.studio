import { SUBSCRIBE } from "sapa";
import MenuItem from "elf/editor/ui/menu-items/MenuItem";

export default class AddIFrame extends MenuItem {
  getIconString() {
    return "web";
  }
  getTitle() {
    return this.props.title || "IFrame";
  }

  clickButton() {
    this.emit("addLayerView", "iframe");
  }

  [SUBSCRIBE("addLayerView")](type) {
    this.setSelected(type === "iframe");
  }

  isHideTitle() {
    return true;
  }
}
