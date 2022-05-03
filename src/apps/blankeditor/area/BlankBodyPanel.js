import { SUBSCRIBE, createComponent } from "sapa";

import "./BlankBodyPanel.scss";
import BlankCanvasView from "./BlankCanvasView";

import PageSubEditor from "apps/common/body-panel/PageSubEditor";
import { TOGGLE_FULLSCREEN } from "elf/editor/types/event";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class BlankBodyPanel extends EditorElement {
  components() {
    return {
      BlankCanvasView,
      PageSubEditor,
    };
  }

  template() {
    return /*html*/ `
      <div class="elf--body-panel">
        <div class="submenu-area">
          ${createComponent("PageSubEditor")}
        </div>
        <div class='editing-area'>
          <div class="canvas-layout">
            ${createComponent("BlankCanvasView")}
          </div>

        </div>
      </div>
    `;
  }

  [SUBSCRIBE(TOGGLE_FULLSCREEN)]() {
    this.refs.$el.toggleFullscreen();
  }
}
