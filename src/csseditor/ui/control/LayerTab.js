import UIElement from "../../../util/UIElement";
import ObjectItems from "./ObjectItems";
import { CLICK } from "../../../util/Event";
import ProjectProperty from "../property/ProjectProperty";
import ProjectInformationProperty from "../property/ProjectInformationProperty";
import LibraryItems from "./Libraryitems";
import ComponentItems from "./Componentitems";
import { editor } from "../../../editor/editor";


export default class LayerTab extends UIElement {
  components() {
    return {
      ObjectItems, 
      ComponentItems,
      ProjectProperty,
      ProjectInformationProperty,
      LibraryItems
    }
  }
  template() {
    return /*html*/`
      <div class='layer-tab'>
        <div class="tab number-tab" data-selected-value="2" ref="$tab">
          <div class="tab-header full" ref="$header">
            <div class="tab-item" data-value="1">
              <label>${editor.i18n('app.tab.title.projects')}</label>
            </div>          
            <div class="tab-item" data-value="2">
              <label>${editor.i18n('app.tab.title.layers')}</label>
            </div>
            <div class='tab-item' data-value='3'>
              <label>${editor.i18n('app.tab.title.libraries')}</label>
            </div>   
            <div class='tab-item' data-value='4'>
              <label>${editor.i18n('app.tab.title.components')}</label>
            </div>
          </div>
          <div class="tab-body" ref="$body">
            <div class="tab-content project-content" data-value="1">
              <ProjectProperty />
              <ProjectInformationProperty />
            </div>
            <div class="tab-content" data-value="2">
              <ObjectItems />
            </div>
            <div class='tab-content' data-value='3'>
              <LibraryItems />
            </div>
            <div class='tab-content' data-value='4'>
              <ComponentItems />
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
