import { EditorElement } from "el/editor/ui/common/EditorElement";
import { createComponent } from "el/sapa/functions/jsx";

import './ObjectItems.scss';

export default class SingleObjectItems extends EditorElement {
  template() {
    return /*html*/`
        <div class="object-items single">
          <div>
            ${createComponent("LayerTreeProperty")}
          </div>
        </div>
    `;
  }

}