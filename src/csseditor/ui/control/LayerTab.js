import UIElement from "../../../util/UIElement";
import ObjectItems from "./ObjectItems";
import { CLICK } from "../../../util/Event";


export default class LayerTab extends UIElement {
  components() {
    return {
      ObjectItems
    }
  }
  template() {
    return `
      <div class='layer-tab'>
        <div class="tab number-tab" data-selected-value="1" ref="$tab">
          <div class="tab-header" ref="$header">
            <div class="tab-item" data-value="1">
              <label>Layers</label>
            </div>
            <div class="tab-item" data-value="2">
              <label>LIBRARIES</label>
            </div>
          </div>
          <div class="tab-body" ref="$body">
            <div class="tab-content" data-value="1">
              <ObjectItems />
            </div>
            <div class="tab-content" data-value="2">

            </div>
          </div>
        </div>
      </div>
    `;
  }

  [CLICK("$header .tab-item")](e) {
    this.refs.$tab.attr(
      "data-selected-value",
      e.$delegateTarget.attr("data-value")
    );
  }

  [CLICK("$extraHeader .tab-item")](e) {
    this.refs.$extraTab.attr(
      "data-selected-value",
      e.$delegateTarget.attr("data-value")
    );
  }
}
