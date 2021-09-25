import { CONFIG } from "el/sapa/Event";
import MenuItem from "./MenuItem";
   
export default class Outline extends MenuItem {
  getIconString() {
    return 'outline';
  }
  getTitle() {
    return "Outline";
  }

  clickButton(e) {
    this.$config.toggle('show.outline');
  }

  [CONFIG('show.outline')] (isShow) {
    this.setSelected(isShow);
  }

}