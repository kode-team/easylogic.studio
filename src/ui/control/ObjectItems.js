import { registElement } from "@sapa/registerElement";
import UIElement from "@sapa/UIElement";
import "../property/LayerTreeProperty";

export default class ObjectItems extends UIElement {
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