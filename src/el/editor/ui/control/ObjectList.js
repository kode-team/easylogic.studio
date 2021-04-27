import { registElement } from "el/base/registElement";

import { EditorElement } from "../common/EditorElement";
import "./LayerTab";

export default class ObjectList extends EditorElement {
  template() {
    return /*html*/`
      <div class="feature-control object-list">
        <object refClass="LayerTab" />
      </div>
    `;
  }

}

registElement( { ObjectList })
