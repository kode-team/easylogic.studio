import { registElement } from "@core/registerElement";
import UIElement from "@core/UIElement";
import LayerTreeProperty from "../property/LayerTreeProperty";


export default class ObjectItems extends UIElement {
  components() {
    return {
      LayerTreeProperty
    }
  }
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