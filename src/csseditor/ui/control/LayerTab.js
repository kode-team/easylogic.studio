import UIElement from "../../../util/UIElement";
import ObjectItems from "./ObjectItems";
import { CLICK } from "../../../util/Event";
import LibraryItems from "./LibraryItems";
import ComponentItems from "./ComponentItems";
import icon from "../icon/icon";
import PreviewToolMenu from "../view/PreviewToolMenu";
import ShortCutItems from "./ShortCutItems";
import property from "../property";


export default class LayerTab extends UIElement {
  components() {
    return {
      ShortCutItems,
      ...property,
      ObjectItems, 
      ComponentItems,
      LibraryItems,
      PreviewToolMenu
    }
  }

  initState() {
    return {
      selectedIndex: 2
    }
  }

  template() {
    return /*html*/`
      <div class='layer-tab'>
        <div class="tab number-tab side-tab side-tab-left" data-selected-value="2" ref="$tab">
          <div class="tab-header full" ref="$header">
            <div class='logo-item'>
              <label class='logo' title='EasyLogic Studio'></label>
            </div>                  
            <div class='tab-item' data-value='4' title="${this.$i18n('app.tab.title.components')}">
              <label>${icon.add}</label>
            </div>          
            <div class="tab-item selected" data-value="2" title="${this.$i18n('app.tab.title.layers')}">
              <label>${icon.account_tree}</label>
            </div>            
            <div class="tab-item" data-value="1" title="${this.$i18n('app.tab.title.projects')}">
              <label>${icon.note}</label>
            </div>         
            <div class='tab-item' data-value='5' title="${this.$i18n('app.tab.title.assets')}">
              <label>${icon.apps}</label>
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
            <div class="tab-content selected" data-value="2">
              <ObjectItems />
            </div>
            <div class='tab-content' data-value='3'>
              <LibraryItems />
            </div>
            <div class='tab-content' data-value='4'>
              <ComponentItems />
            </div>    
            <div class='tab-content' data-value='5'>
              <div class='assets'>
                <ColorAssetsProperty />
                <GradientAssetsProperty />    
                <PatternAssetsProperty />    
                <ImageAssetsProperty />      
                <VideoAssetsProperty />       
                <SVGFilterAssetsProperty />                
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
