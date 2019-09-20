import UIElement from "../../../util/UIElement";
import ObjectItems from "./ObjectItems";
import { CLICK } from "../../../util/Event";
import ProjectProperty from "../property/ProjectProperty";
import ProjectInformationProperty from "../property/ProjectInformationProperty";


export default class LayerTab extends UIElement {
  components() {
    return {
      ObjectItems,
      ProjectProperty,
      ProjectInformationProperty
    }
  }
  template() {
    return /*html*/`
      <div class='layer-tab'>
        <div class="tab number-tab" data-selected-value="2" ref="$tab">
          <div class="tab-header" ref="$header">
            <div class="tab-item" data-value="1">
              <label>Projects</label>
            </div>          
            <div class="tab-item" data-value="2">
              <label>Layers</label>
            </div>
            <div class='tab-item empty-item'></div>   
            <div class='tab-item empty-item'></div>
            <div class='tab-item empty-item'></div>                                 
          </div>
          <div class="tab-body" ref="$body">
            <div class="tab-content project-content" data-value="1">
              <ProjectProperty />
              <ProjectInformationProperty />
            </div>
            <div class="tab-content" data-value="2">
              <ObjectItems />
            </div>
          </div>
        </div>
      </div>
    `;
  }

  [CLICK("$header .tab-item:not(.empty-item)")](e) {
    this.refs.$tab.attr(
      "data-selected-value",
      e.$delegateTarget.attr("data-value")
    );
  }

  [CLICK("$extraHeader .tab-item:not(.empty-item)")](e) {
    this.refs.$extraTab.attr(
      "data-selected-value",
      e.$delegateTarget.attr("data-value")
    );
  }
}
