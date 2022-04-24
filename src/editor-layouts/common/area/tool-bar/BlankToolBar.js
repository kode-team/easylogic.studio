import { EditorElement } from "elf/editor/ui/common/EditorElement";
// import ToolMenu from "./ToolMenu";
import Projects from "elf/editor/ui/menu-items/Projects";

import "./ToolBar.scss";
import { DropdownMenu } from "elf/editor/ui/view/DropdownMenu";
import Undo from "elf/editor/ui/menu-items/Undo";
import Redo from "elf/editor/ui/menu-items/Redo";
import ExportView from "elf/editor/ui/menu-items/ExportView";
import Download from "elf/editor/ui/menu-items/Download";
import ThemeChanger from "elf/editor/ui/menu-items/ThemeChanger";
import { Language } from "elf/editor/types/editor";
import { CONFIG, LOAD } from "sapa";
import ToolBarRenderer from "./ToolBarRenderer";
import { createComponent, createElement } from "sapa";
import { SUBSCRIBE } from "sapa";

export default class BlankToolBar extends EditorElement {
  initState() {
    // logo drop down menu
    // dynamic menu items
    return {
      items: [
        {
          title: "menu.item.fullscreen.title",
          command: "toggle.fullscreen",
          shortcut: "ALT+/",
        },
        { title: "menu.item.shortcuts.title", command: "showShortcutWindow" },
        "-",
        { title: "menu.item.export.title", command: "showExportView" },
        { title: "menu.item.export.title", command: "showEmbedEditorWindow" },
        { title: "menu.item.download.title", command: "downloadJSON" },
        {
          title: "menu.item.save.title",
          command: "saveJSON",
          nextTick: () => {
            this.emit(
              "notify",
              "alert",
              "Save",
              "Save the content on localStorage",
              2000
            );
          },
        },
        {
          title: "menu.item.language.title",
          items: [
            {
              title: "English",
              command: "setLocale",
              args: [Language.EN],
              checked: () => this.$editor.locale === Language.EN,
            },
            {
              title: "Français",
              command: "setLocale",
              args: [Language.FR],
              checked: () => this.$editor.locale === Language.FR,
            },
            {
              title: "Korean",
              command: "setLocale",
              args: [Language.KO],
              checked: () => this.$editor.locale === Language.KO,
            },
          ],
        },
        "-",
        {
          title: "EasyLogic Studio",
          items: [
            {
              type: "link",
              title: "Github",
              href: "https://github.com/easylogic/editor",
            },
            {
              type: "link",
              title: "Learn",
              href: "https://www.easylogic.studio",
            },
          ],
        },
      ],
    };
  }

  components() {
    return {
      ToolBarRenderer,
      ThemeChanger,
      ExportView,
      Download,
      Undo,
      Redo,
      DropdownMenu,
      Projects,
    };
  }
  template() {
    return /*html*/ `
            <div class='elf--tool-bar'>
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
        `;
  }

  [LOAD("$logo")]() {
    return /*html*/ `
            <div class="logo-item">           
                ${createComponent(
                  "DropdownMenu",
                  {
                    ref: "$menu",
                    items: this.state.items, // 로그 메뉴 설정
                    dy: 6,
                  },
                  [createElement("label", { class: "logo" })]
                )}
            </div>                                
        `;
  }

  [CONFIG("language.locale")]() {
    this.refresh();
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
