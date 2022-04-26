import { SUBSCRIBE, createComponent } from "sapa";

import Canvas3DView from "./body-panel/Canvas3DView";
import "./Body3DPanel.scss";

import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class Body3DPanel extends EditorElement {
  components() {
    return {
      Canvas3DView,
    };
  }

  template() {
    return /*html*/ `
      <div class="elf--body-three-panel">
        <div class='editing-area'>
          <div class="canvas-layout">
            ${createComponent("Canvas3DView")}
          </div>
        </div>
      </div>
    `;
  }

  [SUBSCRIBE("bodypanel.toggle.fullscreen")]() {
    this.refs.$el.toggleFullscreen();
  }
}
