import MenuItem from "./MenuItem";

import { CONFIG, SUBSCRIBE } from "sapa";
import { EditingMode } from "elf/editor/types/editor";

export default class SelectTool extends MenuItem {
  afterRender() {
    this.$el.$(".icon").css("transform", "rotate(-30deg)");
  }

  getIconString() {
    return "navigation";
  }

  getTitle() {
    return this.props.title || "Select";
  }

  clickButton() {
    this.emit("addLayerView", "select");
  }

  doSelect() {
    this.setSelected(this.$config.is("editing.mode", EditingMode.SELECT));
  }

  [SUBSCRIBE("refreshSelection")]() {
    this.doSelect();
  }

  isHideTitle() {
    return true;
  }

  [CONFIG("editing.mode")]() {
    this.doSelect();
  }
}
