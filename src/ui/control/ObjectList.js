import UIElement from "@core/UIElement";
import LayerTab from "./LayerTab";

export default class ObjectList extends UIElement {
  components() {
    return {
      LayerTab
    }
  }
  template() {
    return /*html*/`
      <div class="feature-control object-list">
        <LayerTab />
      </div>
    `;
  }

}
