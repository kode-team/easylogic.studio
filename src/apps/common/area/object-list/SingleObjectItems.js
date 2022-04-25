import { createComponent } from "sapa";

import "./ObjectItems.scss";

import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class SingleObjectItems extends EditorElement {
  template() {
    return /*html*/ `
        <div class="object-items single">
          <div>
            ${createComponent("LayerTreeProperty")}
          </div>
        </div>
    `;
  }
}
