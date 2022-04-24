import { EditorElement } from "elf/editor/ui/common/EditorElement";
// import ToolMenu from "./ToolMenu";
import Projects from "elf/editor/ui/menu-items/Projects";

import "./ThreeToolBar.scss";
import { DropdownMenu } from "elf/editor/ui/view/DropdownMenu";
import Undo from "elf/editor/ui/menu-items/Undo";
import Redo from "elf/editor/ui/menu-items/Redo";
import ExportView from "elf/editor/ui/menu-items/ExportView";
import Download from "elf/editor/ui/menu-items/Download";
import Save from "elf/editor/ui/menu-items/Save";
import Outline from "elf/editor/ui/menu-items/Outline";
import SelectTool from "elf/editor/ui/menu-items/SelectTool";
import ThemeChanger from "elf/editor/ui/menu-items/ThemeChanger";
import { Language } from "elf/editor/types/editor";
import { CONFIG, LOAD } from "sapa";
import ToolbarMenu from "elf/editor/menus/menu_list/ToolbarMenu";
import ToolBarRenderer from "./ToolBarRenderer";
import { createComponent, createElement } from "sapa";

export default class ThreeToolBar extends EditorElement {
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
      Outline,
      SelectTool,
      ExportView,
      Download,
      Save,
      Undo,
      Redo,
      DropdownMenu,
      Projects,
      // AddArtboard,
      // AddRect,
      // AddSVGRect
    };
  }
  template() {
    return /*html*/ `
            <div class='elf--tool-bar'>
                ${createComponent("ToolBarRenderer", {
                  items: ToolbarMenu.left(this.$editor),
                })}
                ${createComponent("ToolBarRenderer", {
                  items: ToolbarMenu.center(this.$editor),
                })}
                <div class='right'>
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
