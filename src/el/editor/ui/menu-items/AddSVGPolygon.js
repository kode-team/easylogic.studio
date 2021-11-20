import { registElement } from "el/sapa/functions/registElement";
import MenuItem from "./MenuItem";
 
export default class AddSVGPolygon extends MenuItem {
  getIconString() {
    return 'polygon';
  }
  getTitle() {
    return this.props.title || "Polygon";
  }
 

  clickButton(e) {
    this.emit('addLayerView', 'polygon', {
      'background-color': 'transparent'
    });
  }

  isHideTitle() {
    return true;
  }

}

registElement({ AddSVGPolygon })
