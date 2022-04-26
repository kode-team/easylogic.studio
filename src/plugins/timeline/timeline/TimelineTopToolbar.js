import { createComponent } from "sapa";

import KeyframeTimeControl from "./KeyframeTimeControl";

import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class TimelineTopToolbar extends EditorElement {
  components() {
    return {
      KeyframeTimeControl,
    };
  }

  template() {
    return /*html*/ `
            <div class='timeline-top-toolbar'>
                ${createComponent("KeyframeTimeControl")}
            </div>
        `;
  }
}
