import { CONFIG } from "el/sapa/Event";
import MenuItem from "./MenuItem";
   
export default class Outline extends MenuItem {
  getIconString() {
    return 'outline';
  }
  getTitle() {
    return "Outline";
  }

  isHideTitle() {
    return true;
  }

  clickButton(e) {
    this.$config.toggle('show.outline');
    this.emit('addLayerView', 'select');
  }

  [CONFIG('show.outline')] (isShow) {
    this.setSelected(isShow);
  }

}