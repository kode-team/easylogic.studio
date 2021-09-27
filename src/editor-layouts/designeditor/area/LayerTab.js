import { CLICK } from "el/sapa/Event";
import icon, { iconUse } from "el/editor/icon/icon";

import { EditorElement } from "el/editor/ui/common/EditorElement";

import ObjectItems from "./object-list/ObjectItems";
import CustomAssets from "./object-list/CustomAssets";
import LibraryItems from "./object-list/LibraryItems";
import AssetItems from "./object-list/AssetItems";



export default class LayerTab extends EditorElement {

  components() {
    return {
      AssetItems,
      LibraryItems,
      CustomAssets,
      ObjectItems,
    }
  }

  initState() {
    return {
      selectedIndexValue: 2
    }
  }

  template() {
    return /*html*/`
      <div class='layer-tab'>
        <div class="tab number-tab side-tab side-tab-left" data-selected-value="2" ref="$tab">
          <div class="tab-header" ref="$header">   
            <div class="tab-item selected" data-value="2" data-direction="right" data-tooltip="${this.$i18n('app.tab.title.layers')}">
              <label>${iconUse('layers')}</label>
            </div>            
            <div class='tab-item' data-value='3' data-direction="right"  data-tooltip="${this.$i18n('app.tab.title.libraries')}">
              <label>${iconUse("auto_awesome")}</label>
            </div>                     
            <div class='tab-item' data-value='5' data-direction="right"  data-tooltip="${this.$i18n('app.tab.title.assets')}">
              <label>${iconUse("apps")}</label>
            </div>   
            <div class='tab-item' data-value='6' data-direction="right"  data-tooltip="${this.$i18n('app.tab.title.components')}">
              <label>${iconUse("plugin")}</label>
            </div>            

            ${this.$injectManager.getTargetMenuItems('leftbar.tab').map(it => {
              const { value, title} = it.class;   
              
              let iconString = it.class.icon;
              if (icon[it.class.icon]) {
                iconString = iconUse(it.class.icon);
              }
              return /*html*/`
                <div class='tab-item' data-value='${value}' data-direction="right"  data-tooltip="${title}">
                  <label>${iconString || title}</label>
                </div>
              `
            })}

          </div>
          <div class="tab-body" ref="$body">
            <div class="tab-content selected" data-value="2">
              <object refClass="ObjectItems" />
            </div>
            <div class='tab-content' data-value='3'>
              <object refClass="LibraryItems" />
            </div>            
            <div class='tab-content' data-value='5'>
              <object refClass="AssetItems" />            
              <div class='assets'>
                <object refClass="GradientAssetsProperty" />    
                <object refClass="PatternAssetsProperty" />    
                <object refClass="ImageAssetsProperty" />      
                <object refClass="VideoAssetsProperty" />       
                <object refClass="SVGFilterAssetsProperty" />                
              </div>
            </div>
            <div class='tab-content' data-value='6'>
              <object refClass="CustomAssets" />
            </div>
            ${this.$injectManager.getTargetMenuItems('leftbar.tab').map(it => {
              const { value } = it.class;
              return /*html*/`
                <div class='tab-content' data-value='${value}'>
                  ${this.$injectManager.generate(`leftbar.tab.${value}`)}
                </div>
              `
            })}
          </div>
        </div>
      </div>
    `;
  }

  [CLICK("$header .tab-item:not(.extra-item)")](e) {

    var selectedIndexValue = e.$dt.attr('data-value')
    if (this.state.selectedIndexValue === selectedIndexValue) {
      return; 
    }

    this.$el.$$(`[data-value="${this.state.selectedIndexValue}"]`).forEach(it => it.removeClass('selected'))
    this.$el.$$(`[data-value="${selectedIndexValue}"]`).forEach(it => it.addClass('selected'))
    this.setState({ selectedIndexValue }, false);
  }
}