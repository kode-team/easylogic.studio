import UIElement from "../../../util/UIElement";
import ObjectItems from "./ObjectItems";
import { CLICK } from "../../../util/Event";
import ProjectProperty from "../property/ProjectProperty";
import ProjectInformationProperty from "../property/ProjectInformationProperty";
import LibraryItems from "./Libraryitems";
import ComponentItems from "./Componentitems";
import { editor } from "../../../editor/editor";
import icon from "../icon/icon";

const i18n = editor.initI18n('app.tab.title');

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
        <div class="tab number-tab side-tab side-tab-left" data-selected-value="4" ref="$tab">
          <div class="tab-header full" ref="$header">
            <div class='tab-item' data-value='4' title='${i18n('components')}'>
              <label>${icon.add}</label>
            </div>          
            <div class="tab-item" data-value="2" title='${i18n('layers')}'>
              <label>${icon.account_tree}</label>
            </div>            
            <div class="tab-item" data-value="1" title='${i18n('projects')}'>
              <label>${icon.note}</label>
            </div>         
            <div class='tab-item' data-value='3' title='${i18n('libraries')}'>
              <label>${icon.local_library}</label>
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
