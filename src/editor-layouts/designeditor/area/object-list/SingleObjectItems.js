import { EditorElement } from "el/editor/ui/common/EditorElement";

import './ObjectItems.scss';

export default class SingleObjectItems extends EditorElement {
  template() {
    return /*html*/`
        <div class="object-items single">
          <div>
            <object refClass="LayerTreeProperty" />
          </div>
        </div>
    `;
  }

}