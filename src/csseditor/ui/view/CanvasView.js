import UIElement, { EVENT } from "../../../util/UIElement";

import { editor } from "../../../editor/editor";
import { Length } from "../../../editor/unit/Length";
import { Project } from "../../../editor/items/Project";
import { ArtBoard } from "../../../editor/items/ArtBoard";
import { CLICK } from "../../../util/Event";
import { CHANGE_SELECTION } from "../../types/event";

export default class CanvasView extends UIElement {
  afterRender() {
    var project = editor.addProject(new Project());
    var artboard = project.add(new ArtBoard());

    editor.selection.select(artboard);
  }
  template() {
    return `
            <div class='page-view'>
                <div class="page-canvas" ref="$canvas">

                </div>          
            </div>
        `;
  }

  [EVENT("refreshCanvas")]() {
    var current = editor.selection.current;
    if (current) {
      this.refs.$canvas.cssText(current.toString());
    }
  }

  [CLICK("$el")]() {
    this.emit(CHANGE_SELECTION);
  }
  refresh() {
    this.setBackgroundColor();
  }

  setBackgroundColor() {
    var canvasCSS = {
      width: Length.px(editor.config.get("canvas.width")),
      height: Length.px(editor.config.get("canvas.height"))
    };

    this.refs.$canvas.css(canvasCSS);
  }
}
