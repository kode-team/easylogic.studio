import { registElement } from "el/base/registerElement";

import { EditorElement } from "../common/EditorElement";
import "../property/LayerTreeProperty";

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