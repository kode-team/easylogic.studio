import { BIND, CLICK, createComponent } from "sapa";

import AssetItems from "./object-list/AssetItems";
import CustomAssets from "./object-list/CustomAssets";
import LibraryItems from "./object-list/LibraryItems";
import SingleObjectItems from "./object-list/SingleObjectItems";

import icon, { iconUse } from "elf/editor/icon/icon";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class ItemLayerTab extends EditorElement {
  components() {
    return {
      AssetItems,
      LibraryItems,
      CustomAssets,
      SingleObjectItems,
    };
  }

  initState() {
    return {
      selectedIndexValue: 2,
    };
  }

  afterRender() {
    this.$el.toggle(this.$config.get("editor.design.mode") === "item");
  }

  [BIND("$el")]() {
    return {
      style: {
        display:
          this.$config.get("editor.design.mode") === "item" ? "block" : "none",
      },
    };
  }

  template() {
    return /*html*/ `
      <div class='layer-tab'>
        <div class="tab number-tab side-tab side-tab-left" data-selected-value="2" ref="$tab">
          <div class="tab-header" ref="$header">   
            <div class="tab-item selected" data-value="2" data-direction="right" data-tooltip="${this.$i18n(
              "app.tab.title.layers"
            )}">
              <label>${iconUse("layers")}</label>
            </div>            
            <div class='tab-item' data-value='6' data-direction="right"  data-tooltip="${this.$i18n(
              "app.tab.title.components"
            )}">
              <label>${iconUse("plugin")}</label>
            </div>            

            ${this.$injectManager
              .getTargetUI("leftbar.tab")
              .filter((it) => {
                return (
                  it.class.designMode && it.class.designMode.includes("item")
                );
              })
              .map((it) => {
                const { value, title } = it.class;

                let iconString = it.class.icon;
                if (icon[it.class.icon]) {
                  iconString = iconUse(it.class.icon);
                }
                return /*html*/ `
                <div class='tab-item' data-value='${value}' data-direction="right"  data-tooltip="${title}">
                  <label>${iconString || title}</label>
                </div>
              `;
              })}

          </div>
          <div class="tab-body" ref="$body">
            <div class="tab-content selected" data-value="2">
              ${createComponent("SingleObjectItems")}
            </div>
            <div class='tab-content' data-value='6'>
              ${createComponent("CustomAssets")}
            </div>
            ${this.$injectManager
              .getTargetUI("leftbar.tab")
              .filter((it) => {
                return (
                  it.class.designMode && it.class.designMode.includes("item")
                );
              })
              .map((it) => {
                const { value } = it.class;
                return /*html*/ `
                <div class='tab-content' data-value='${value}'>
                  ${this.$injectManager.generate(`leftbar.tab.${value}`)}
                </div>
              `;
              })}
          </div>
        </div>
      </div>
    `;
  }

  [CLICK("$header .tab-item:not(.extra-item)")](e) {
    var selectedIndexValue = e.$dt.attr("data-value");
    if (this.state.selectedIndexValue === selectedIndexValue) {
      return;
    }

    this.$el
      .$$(`[data-value="${this.state.selectedIndexValue}"]`)
      .forEach((it) => it.removeClass("selected"));
    this.$el
      .$$(`[data-value="${selectedIndexValue}"]`)
      .forEach((it) => it.addClass("selected"));
    this.setState({ selectedIndexValue }, false);
  }
}