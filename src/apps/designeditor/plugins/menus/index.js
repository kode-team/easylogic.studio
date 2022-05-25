import DefaultMenu from "apps/designeditor/menus/DefaultMenu";
import { Language } from "elf/editor/types/editor";

export default function (editor) {
  editor.registerMenu("toolbar.logo", [
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
          title: "elf document",
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
  ]);
  editor.registerMenu("toolbar.left", DefaultMenu);
}
