import { registElement, SUBSCRIBE } from "sapa";

import { createDesignEditor } from "apps/";

import BaseWindow from "./BaseWindow";
import "./ExportWindow.scss";

export default class EmbedEditorWindow extends BaseWindow {
  getClassName() {
    return "elf--export-window";
  }

  getTitle() {
    return "Mini Editor";
  }

  initState() {
    return {
      selectedIndex: 1,
    };
  }

  refresh() {
    if (this.$el.isShow()) {
      createDesignEditor({
        container: this.refs.$body.el,
        config: {
          "editor.design.mode": "item",
        },
      });
    }
  }

  getBody() {
    return /*html*/ `
        <div class="test" ref="$body">

      </div>
        `;
  }

  [SUBSCRIBE("showEmbedEditorWindow")]() {
    this.show();
    this.refresh();
  }
}

registElement({ EmbedEditorWindow });
