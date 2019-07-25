import MenuItem from "./MenuItem";
import { editor } from "../../../../editor/editor";

import { Length } from "../../../../editor/unit/Length";
import Color from "../../../../util/Color";
import { CubeLayer } from "../../../../editor/items/layers/CubeLayer";
import icon from "../../icon/icon";
 
export default class AddCube extends MenuItem {
  getIconString() {
    return icon.cube;
  }
  getTitle() {
    return "Cube";
  }

  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    var artboard = editor.selection.currentArtboard

    if (artboard) {
      var layer = artboard.add(new CubeLayer({
        width: Length.px(100),
        height: Length.px(100),
        'background-color': Color.random()
      }))

      editor.selection.select(layer);

      this.emit('refreshAll')
      this.emit('refreshSelection');
      this.emit('hideSubEditor');
    }
  }
}
