import { BIND, createComponent } from "sapa";

import { EditorElement } from "elf/editor/ui/common/EditorElement";
export default class SingleInspector extends EditorElement {
  afterRender() {
    this.$el.toggle(this.$config.get("editor.design.mode") === "item");
  }

  [BIND("$el")]() {
    return {
      style: {
        display:
          this.$config.get("editor.design.mode") === "item" ? "block" : "none",
      },
    };
  }

  template() {
    return /*html*/ `
      <div class="feature-control inspector">
        <div>
              ${createComponent("AlignmentProperty")}
              ${createComponent("DepthProperty")}
              ${createComponent("PathToolProperty")}
              ${createComponent("PositionProperty")}
              ${createComponent("AppearanceProperty")}

              ${this.$injectManager.generate(
                "inspector.tab.style"
              )}                             
              <div class='empty'></div>
        </div>
      </div>
    `;
  }
}
