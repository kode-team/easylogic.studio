import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddSVGText extends MenuItem {
  getIconString() {
    return icon.title;
  }
  getTitle() {
    return this.props.title || "SVG Text";
  }
 

  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    this.emit('add.type', 'svgtext');
  }

}
