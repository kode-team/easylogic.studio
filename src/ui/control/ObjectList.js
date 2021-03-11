import { registElement } from "@core/registerElement";
import UIElement from "@core/UIElement";
import "./LayerTab";

export default class ObjectList extends UIElement {
  template() {
    return /*html*/`
      <div class="feature-control object-list">
        <object refClass="LayerTab" />
      </div>
    `;
  }

}

registElement( { ObjectList })
