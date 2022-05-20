import { CONFIG, createComponent } from "sapa";

// import ToolMenu from "./ToolMenu";

import LanguageSelector from "../status-bar/LanguageSelector";
import LayoutSelector from "../status-bar/LayoutSelector";
import "./ToolBar.scss";
import ToolBarRenderer from "./ToolBarRenderer";

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

export class ToolBar extends EditorElement {
  initState() {
    return {
      items: [
        {
          type: "dropdown",
          style: {
            padding: "12px 0px 12px 12px",
          },
          icon: `<div class="logo-item"><label class='logo'></label></div>`,
          items: [
            {
              title: "menu.item.fullscreen.title",
              command: "toggle.fullscreen",
              shortcut: "ALT+/",
            },
            {
              title: "menu.item.shortcuts.title",
              command: "showShortcutWindow",
            },
            "-",
            { title: "menu.item.export.title", command: "showExportView" },
            {
              title: "menu.item.export.title",
              command: "showEmbedEditorWindow",
            },
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
                  checked: (editor) => editor.locale === Language.EN,
                },
                {
                  title: "Français",
                  command: "setLocale",
                  args: [Language.FR],
                  checked: (editor) => editor.locale === Language.FR,
                },
                {
                  title: "Korean",
                  command: "setLocale",
                  args: [Language.KO],
                  checked: (editor) => editor.locale === Language.KO,
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
                <div class="logo-area">
                  ${createComponent("ToolBarRenderer", {
                    items: this.state.items,
                  })}                
                </div>
                <div class="toolbar-area">
                  <div class="left">
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
                      ${this.$injectManager.generate("toolbar.right")}
                      ${createComponent("ThemeChanger")}
                  </div>
                </div>
            </div>
        `;
  }

  [CONFIG("language.locale")]() {
    this.refresh();
  }
}
