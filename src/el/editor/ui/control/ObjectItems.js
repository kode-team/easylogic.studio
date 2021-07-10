import { registElement } from "el/base/registElement";

import { EditorElement } from "../common/EditorElement";

export default class ObjectItems extends EditorElement {
  template() {
    return /*html*/`
      <div class='object-items'>
        <div>
          <object refClass="LayerTreeProperty" />
        </div>
      </div>
    `;
  }

}

registElement({ ObjectItems })