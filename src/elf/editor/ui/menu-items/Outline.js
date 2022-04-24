import { CONFIG } from "sapa";
import MenuItem from "./MenuItem";

export default class Outline extends MenuItem {
  getIconString() {
    return "outline";
  }
  getTitle() {
    return "Outline";
  }

  isHideTitle() {
    return true;
  }

  clickButton() {
    this.$config.toggle("show.outline");
    this.emit("addLayerView", "select");
  }

  [CONFIG("show.outline")](isShow) {
    this.setSelected(isShow);
  }
}
