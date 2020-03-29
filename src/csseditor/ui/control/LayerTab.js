import UIElement from "../../../util/UIElement";
import ObjectItems from "./ObjectItems";
import { CLICK } from "../../../util/Event";
import ProjectProperty from "../property/ProjectProperty";
import ProjectInformationProperty from "../property/ProjectInformationProperty";
import LibraryItems from "./Libraryitems";
import ComponentItems from "./Componentitems";
import icon from "../icon/icon";
import ImageAssetsProperty from "../property/ImageAssetsProperty";
import GradientAssetsProperty from "../property/GradientAssetsProperty";
import ColorAssetsProperty from "../property/ColorAssetsProperty";
import SVGFilterAssetsProperty from "../property/SVGFilterAssetsProperty";
import PreviewToolMenu from "../view/PreviewToolMenu";


export default class LayerTab extends UIElement {
  components() {
    return {
      ImageAssetsProperty,
      GradientAssetsProperty,
      ColorAssetsProperty,
      SVGFilterAssetsProperty,      
      ObjectItems, 
      ComponentItems,
      ProjectProperty,
      ProjectInformationProperty,
      LibraryItems,
      PreviewToolMenu
    }
  }

  initState() {
    return {
      selectedIndex: 4 
    }
  }

  template() {
    return /*html*/`
      <div class='layer-tab'>
        <div class="tab number-tab side-tab side-tab-left" data-selected-value="4" ref="$tab">
          <div class="tab-header full" ref="$header">
            <div class='logo-item'>
              <label class='logo' title='EasyLogic Studio'></label>
            </div>                  
            <div class='tab-item selected' data-value='4' >
              <label>${icon.add}</label>
              <div class='title'>${this.$i18n('app.tab.title.components')}</div>
            </div>          
            <div class="tab-item" data-value="2">
              <label>${icon.account_tree}</label>
              <div class='title'>${this.$i18n('app.tab.title.layers')}</div>
            </div>            
            <div class="tab-item" data-value="1">
              <label>${icon.note}</label>
              <div class='title'>${this.$i18n('app.tab.title.projects')}</div>
            </div>         
            <div class='tab-item' data-value='5'>
              <label>${icon.view_list}</label>
              <div class='title'>${this.$i18n('app.tab.title.assets')}</div>
            </div>   

            <div class='tab-item extra-item' >
              <PreviewToolMenu />
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
            <div class='tab-content selected' data-value='4'>
              <ComponentItems />
            </div>    
            <div class='tab-content' data-value='5'>
              <div class='assets'>
                <ImageAssetsProperty />
                <!--SVGProperty /-->              
                <SVGFilterAssetsProperty />
                <!-- SVGPathAssetsProperty /-->
                <ColorAssetsProperty />
                <GradientAssetsProperty />    
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  [CLICK("$header .tab-item:not(.extra-item)")](e) {

    var selectedIndex = +e.$dt.attr('data-value')
    if (this.state.selectedIndex === selectedIndex) {
      return; 
    }

    this.$el.$$(`[data-value="${this.state.selectedIndex}"]`).forEach(it => it.removeClass('selected'))
    this.$el.$$(`[data-value="${selectedIndex}"]`).forEach(it => it.addClass('selected'))
    this.setState({ selectedIndex }, false);
  }
}
