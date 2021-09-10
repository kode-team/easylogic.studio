import { EditorElement } from "el/editor/ui/common/EditorElement";

import './ObjectItems.scss';

export default class ObjectItems extends EditorElement {
  template() {
    return /*html*/`
        <div class="object-items">
          <object refClass="ProjectProperty" />
          <object refClass="LayerTreeProperty" />
        </div>
    `;
  }

}