import { createComponent } from "sapa";

import "./ObjectItems.scss";

import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class ObjectItems extends EditorElement {
  template() {
    return /*html*/ `
        <div class="object-items">
          <div>
            ${createComponent("ProjectProperty")}
          </div>
          <div>
            ${createComponent("LayerTreeProperty")}
          </div>
        </div>
    `;
  }
}
