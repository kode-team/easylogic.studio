import { CONFIG, LOAD, createComponent, createElement } from "sapa";

// import ToolMenu from "./ToolMenu";

import LanguageSelector from "../status-bar/LanguageSelector";
import LayoutSelector from "../status-bar/LayoutSelector";
import "./ToolBar.scss";
import ToolBarRenderer from "./ToolBarRenderer";

import ToolbarMenu from "elf/editor/menus/menu_list/ToolbarMenu";
import { Language } from "elf/editor/types/editor";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import Download from "elf/editor/ui/menu-items/Download";
import ExportView from "elf/editor/ui/menu-items/ExportView";
import Outline from "elf/editor/ui/menu-items/Outline";
import Redo from "elf/editor/ui/menu-items/Redo";
import Save from "elf/editor/ui/menu-items/Save";
import ThemeChanger from "elf/editor/ui/menu-items/ThemeChanger";
import Undo from "elf/editor/ui/menu-items/Undo";
import { DropdownMenu } from "elf/editor/ui/view/DropdownMenu";

export default class ToolBar extends EditorElement {
  initState() {
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
            this.alert("Save", "Save the content on localStorage", 2000);
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
      LayoutSelector,
      LanguageSelector,
      ThemeChanger,
      Outline,
      ExportView,
      Download,
      Save,
      Undo,
      Redo,
      DropdownMenu,
    };
  }
  template() {
    return /*html*/ `
            <div class='elf--tool-bar'>
                ${createComponent("ToolBarRenderer", {
                  items: ToolbarMenu.left(this.$editor),
                })}
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
                    ${this.$injectManager.generate("toolbar.right")}
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
                    items: this.state.items,
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
}
