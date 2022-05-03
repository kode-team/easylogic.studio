import { BIND, CONFIG, SUBSCRIBE, createComponent } from "sapa";

import CanvasView from "./body-panel/CanvasView";
import HorizontalRuler from "./body-panel/HorizontalRuler";
import PageSubEditor from "./body-panel/PageSubEditor";
import VerticalRuler from "./body-panel/VerticalRuler";
import "./BodyPanel.scss";

import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class BodyPanel extends EditorElement {
  components() {
    return {
      CanvasView,
      VerticalRuler,
      HorizontalRuler,
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
          ${createComponent("HorizontalRuler")}
          ${createComponent("VerticalRuler")}
          <div class="canvas-layout">
            ${createComponent("CanvasView")}
          </div>

        </div>
      </div>
    `;
  }

  [BIND("$el")]() {
    return {
      class: `elf--body-panel ${this.$config.get("show.ruler") ? "ruler" : ""}`,
    };
  }

  [CONFIG("show.ruler")]() {
    this.refresh();
  }

  [SUBSCRIBE("bodypanel.toggle.fullscreen")]() {
    this.refs.$el.toggleFullscreen();
  }
}
