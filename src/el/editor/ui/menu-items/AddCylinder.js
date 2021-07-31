import { registElement } from "el/sapa/functions/registElement";
import MenuItem from "./MenuItem";
 
export default class AddCylinder extends MenuItem {
  getIconString() {
    return 'cylinder';
  }
  getTitle() {
    return this.props.title || "Cylinder";
  }

  getClassName() {
    return 'cylinder'
  }

  isHideTitle() {
    return true; 
  }  

  clickButton(e) {

    this.emit('addLayerView', 'cylinder');
  }

}

registElement({ AddCylinder })
