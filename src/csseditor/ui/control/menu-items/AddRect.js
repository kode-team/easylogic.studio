import MenuItem from "./MenuItem";
import { editor } from "../../../../editor/editor";
import { Layer } from "../../../../editor/items/Layer";
import icon from "../../icon/icon";
import { CHANGE_SELECTION } from "../../../types/event";
import { Length } from "../../../../editor/unit/Length";
import Color from "../../../../util/Color";

export default class AddRect extends MenuItem {
  getIconString() {
    return icon.add_box;
  }
  getTitle() {
    return "Rect";
  }

  clickButton(e) {
    var artboard = editor.selection.currentArtboard

    if (artboard) {
      var layer = artboard.add(new Layer({
        width: Length.px(100),
        height: Length.px(100),
        'background-color': Color.random()
      }))

      editor.selection.select(layer);

      this.emit('addElement');
      this.emit('refreshCanvas');
    }
  }
}
