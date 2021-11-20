import { registElement } from "el/sapa/functions/registElement";
import MenuItem from "./MenuItem";
 
export default class AddSVGStar extends MenuItem {
  getIconString() {
    return 'star';
  }
  getTitle() {
    return this.props.title || "Star";
  }
 

  clickButton(e) {
    this.emit('addLayerView', 'star', {
      'background-color': 'transparent'
    });
  }

  isHideTitle() {
    return true;
  }

}

registElement({ AddSVGStar })
