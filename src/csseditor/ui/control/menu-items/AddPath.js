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
    var artboard = editor.selection.currentArtboard

    if (artboard) {
      var layer = artboard.add(new SVGLayer({
        width: Length.px(100),
        height: Length.px(100),
        'background-color': Color.random()
      }))

      layer.add(new SVGPathItem({
        d: 'M 0,0 L 10 20'
      }));

      editor.selection.select(layer);

      this.emit('refreshAll')
      this.emit('refreshSelection');
    }
  }
}
