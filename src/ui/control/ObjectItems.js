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
          <span refClass="LayerTreeProperty" />
        </div>
      </div>
    `;
  }

}
