import { registElement } from "el/sapa/functions/registElement";
import MenuItem from "./MenuItem";
 
export default class AddSpline extends MenuItem {
  getIconString() {
    return 'smooth';
  }
  getTitle() {
    return this.props.title || "Spline";
  }
 

  clickButton(e) {
    this.emit('addLayerView', 'spline', {
      'background-color': 'transparent'
    });
  }

  isHideTitle() {
    return true;
  }

}

registElement({ AddSpline })
