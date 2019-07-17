import MenuItem from "./MenuItem";
import icon from "../../icon/icon";
import { SVGLayer } from "../../../../editor/items/layers/SVGLayer";
import { editor } from "../../../../editor/editor";
import { Length } from "../../../../editor/unit/Length";
import Color from "../../../../util/Color";
import { SVGPathItem } from "../../../../editor/items/layers/SVGPathItem";
 
export default class AddPath extends MenuItem {
  getIconString() {
    return icon.edit;
  }
  getTitle() {
    return "Path";
  }


  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    this.emit('showPathEditor', 'move');
  }
}
