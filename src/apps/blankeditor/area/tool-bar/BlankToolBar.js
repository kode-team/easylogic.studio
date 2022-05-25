import { createComponent, SUBSCRIBE } from "sapa";

import "./BlankToolBar.scss";

import ToolBarRenderer from "apps/common/area/tool-bar/ToolBarRenderer";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import ExportView from "elf/editor/ui/menu-items/ExportView";
import ThemeChanger from "elf/editor/ui/menu-items/ThemeChanger";
import { DropdownMenu } from "elf/editor/ui/view/DropdownMenu";

export default class BlankToolBar extends EditorElement {
  components() {
    return {
      ToolBarRenderer,
      ThemeChanger,
      ExportView,
      DropdownMenu,
    };
  }
  template() {
    return /*html*/ `
            <div class='elf--blank-tool-bar'>
              <div class="logo-area">
                ${createComponent("ToolBarRenderer", {
                  items: this.$menu.getTargetMenu("toolbar.logo"),
                })}
              </div>            
              <div class="toolbar-area">
                <div class='left'>
                    ${createComponent("ToolBarRenderer", {
                      items: this.$menu.getTargetMenu("toolbar.left"),
                    })}
                    ${this.$injectManager.generate(
                      "toolbar.left"
                    )}                                        
                </div>
                <div class='center'>
                    ${createComponent("ToolBarRenderer", {
                      items: this.$menu.getTargetMenu("toolbar.center"),
                    })}
                    ${this.$injectManager.generate(
                      "toolbar.center"
                    )}                                        
                </div>
                <div class='right'>
                    ${createComponent("ToolBarRenderer", {
                      items: this.$menu.getTargetMenu("toolbar.right"),
                    })}                
                    ${this.$injectManager.generate(
                      "toolbar.right"
                    )}                    
                    ${createComponent("ThemeChanger")}
                </div>
              </div>
            </div>
        `;
  }

  [SUBSCRIBE("updateMenu")](target) {
    if (
      target === "toolbar.left" ||
      target === "toolbar.center" ||
      target === "toolbar.right"
    ) {
      this.refresh();
    }
  }
}
