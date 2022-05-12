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
          ${createComponent("PageSubEditor", { ref: "subeditor" })}
        </div>
        <div class='editing-area' ref="$area">
          ${createComponent("HorizontalRuler", { ref: "hruler" })}
          ${createComponent("VerticalRuler", { ref: "vruler" })}
          <div class="canvas-layout">
            ${createComponent("CanvasView", { ref: "canvas" })}
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

  [CONFIG("editor.cursor")]() {
    this.state.cursor = this.$config.get("editor.cursor");
    this.state.cursorArgs = this.$config.get("editor.cursor.args");
    this.bindData("$container");
  }

  [CONFIG("editor.cursor.args")]() {
    this.state.cursor = this.$config.get("editor.cursor");
    this.state.cursorArgs = this.$config.get("editor.cursor.args");
    this.bindData("$area");
  }

  async [BIND("$area")]() {
    const cursor = await this.$context.cursorManager.load(
      this.state.cursor,
      ...(this.state.cursorArgs || [])
    );
    return {
      style: {
        cursor,
      },
    };
  }
}
