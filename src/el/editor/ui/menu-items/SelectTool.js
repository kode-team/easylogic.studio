import MenuItem from "./MenuItem";

import { SUBSCRIBE } from "el/sapa/Event";
 
export default class SelectTool extends MenuItem {

  afterRender() {
    this.$el.$('.icon').css('transform', 'rotate(-30deg)');
  }

  getIconString() {
    return 'navigation';
  }
  
  getTitle() {
    return this.props.title || "Select";
  }

  clickButton(e) {
    this.emit('addLayerView', 'select');
  }

  [SUBSCRIBE('addLayerView')] (type) {
    this.setSelected(type === 'select');
  }

  [SUBSCRIBE('refreshSelection')] () {
    this.setSelected(this.$selection.isEmpty);
  }  

  isHideTitle() {
    return true;
  }
}