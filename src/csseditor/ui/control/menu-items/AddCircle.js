import MenuItem from "./MenuItem";
import { editor } from "../../../../editor/editor";
import { Layer } from "../../../../editor/items/Layer";
import icon from "../../icon/icon";
import { CHANGE_SELECTION } from "../../../types/event";
import { Length } from "../../../../editor/unit/Length";
import Color from "../../../../util/Color";

export default class AddCircle extends MenuItem {
  getIconString() {
    return icon.add_circle;
  }
  getTitle() {
    return "Circle";
  }

  clickButton(e) {
    var artboard = editor.selection.currentArtboard

    if (artboard) {
      var layer = artboard.add(new Layer({
        width: Length.px(100),
        height: Length.px(100),
        'background-color': Color.random(),
        'border-radius': 'border-radius: 100%'
      }))

      editor.selection.select(layer);

      this.emit('addElement');
      this.emit('refreshCanvas');
      this.emit(CHANGE_SELECTION)
    }
  }
}
