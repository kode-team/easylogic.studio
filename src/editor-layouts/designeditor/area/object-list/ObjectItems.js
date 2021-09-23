import { EditorElement } from "el/editor/ui/common/EditorElement";

import './ObjectItems.scss';

export default class ObjectItems extends EditorElement {
  template() {
    return /*html*/`
        <div class="object-items">
          <div>
            <object refClass="ProjectProperty" />
          </div>
          <div>
            <object refClass="LayerTreeProperty" />
          </div>
        </div>
    `;
  }

}