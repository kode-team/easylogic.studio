import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { createComponent } from "sapa";

import "./ObjectItems.scss";

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
