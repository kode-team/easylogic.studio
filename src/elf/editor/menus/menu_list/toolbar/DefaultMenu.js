import { iconUse } from "elf/editor/icon/icon";
import { EditingMode, Language } from "elf/editor/types/editor";
import { KeyStringMaker } from "elf/editor/types/key";

export default [
  {
    type: "dropdown",
    style: {
      "margin-left": "12px",
    },
    icon: `<div class="logo-item"><label class='logo'></label></div>`,
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
  // {
  //     type: 'button',
  //     icon: 'undo',
  //     action: (editor) => {
  //         editor.context.config.toggle('history.undo');
  //     }
  // },
  // {
  //     type: 'button',
  //     icon: 'redo',
  //     action: (editor) => {
  //         editor.context.config.toggle('history.redo');
  //     }
  // },
  // {
  //     type: 'button',
  //     icon: 'outline',
  //     selected: (editor) => editor.context.config.true('show.outline'),
  //     events: ['config:show.outline'],
  //     action: (editor) => {
  //         editor.context.config.toggle('show.outline');
  //     }
  // },
  {
    type: "button",
    icon: "navigation",
    events: ["config:editing.mode"],
    selected: (editor) => {
      return editor.context.config.is("editing.mode", EditingMode.SELECT);
    },
    action: (editor) => {
      editor.emit("addLayerView", "select");
      editor.context.config.is("editing.mode.itemType", EditingMode.SELECT);
    },
  },
  {
    type: "button",
    icon: "artboard",
    events: ["config:editing.mode", "config:editing.mode.itemType"],
    selected: (editor) => {
      return (
        editor.context.config.is("editing.mode", EditingMode.APPEND) &&
        editor.context.config.is("editing.mode.itemType", "artboard")
      );
    },
    action: (editor) => {
      editor.emit("addLayerView", "artboard");
    },
  },
  {
    type: "dropdown",
    icon: (editor, dropdown) => {
      return (
        dropdown.findItem(editor.context.config.get("editing.css.itemType"))
          ?.icon || iconUse("rect")
      );
    },
    items: [
      {
        icon: iconUse("rect"),
        title: "Rect Layer",
        key: "rect",
        command: "addLayerView",
        args: [
          "rect",
          {
            backgroundColor: "#ececec",
          },
        ],
        closable: true,
        nextTick: (editor) => {
          editor.context.config.set("editing.css.itemType", "rect");
        },
        shortcut: KeyStringMaker({ key: "R" }),
      },
      {
        icon: iconUse("lens"),
        title: "Circle Layer",
        key: "circle",
        command: "addLayerView",
        args: ["circle"],
        closable: true,
        nextTick: (editor) => {
          editor.context.config.set("editing.css.itemType", "circle");
        },
        shortcut: KeyStringMaker({ key: "O" }),
      },
      {
        icon: iconUse("title"),
        title: "Text",
        key: "text",
        command: "addLayerView",
        args: ["text"],
        closable: true,
        nextTick: (editor) => {
          editor.context.config.set("editing.css.itemType", "text");
        },
        shortcut: KeyStringMaker({ key: "T" }),
      },
      {
        icon: iconUse("image"),
        title: "Image",
        key: "image",
        command: "addLayerView",
        args: ["image"],
        closable: true,
        nextTick: (editor) => {
          editor.context.config.set("editing.css.itemType", "image");
        },
        shortcut: KeyStringMaker({ key: "I" }),
      },
      "-",
      {
        icon: iconUse("video"),
        title: "Video",
        key: "video",
        command: "addLayerView",
        args: ["video"],
        closable: true,
        nextTick: (editor) => {
          editor.context.config.set("editing.css.itemType", "video");
        },
        shortcut: KeyStringMaker({ key: "V" }),
      },
      {
        icon: iconUse("iframe"),
        title: "IFrame",
        key: "iframe",
        command: "addLayerView",
        args: ["iframe"],
        closable: true,
        nextTick: (editor) => {
          editor.context.config.set("editing.css.itemType", "iframe");
        },
        shortcut: KeyStringMaker({ key: "F" }),
      },
      {
        icon: iconUse("rect"),
        title: "SampleLayer",
        key: "sample",
        command: "addLayerView",
        args: ["sample"],
        closable: true,
        nextTick: (editor) => {
          editor.context.config.set("editing.css.itemType", "sample");
        },
      },
    ],
    events: [
      "config:editing.mode",
      "config:editing.mode.itemType",
      "config:editing.css.itemType",
    ],
    selected: (editor) => {
      return (
        editor.context.config.is("editing.mode", EditingMode.APPEND) &&
        (editor.context.config.is("editing.mode.itemType", "rect") ||
          editor.context.config.is("editing.mode.itemType", "circle") ||
          editor.context.config.is("editing.mode.itemType", "text") ||
          editor.context.config.is("editing.mode.itemType", "image") ||
          editor.context.config.is("editing.mode.itemType", "video") ||
          editor.context.config.is("editing.mode.itemType", "iframe"))
      );
    },
    selectedKey: (editor) => {
      return editor.context.config.get("editing.css.itemType");
    },
  },
  {
    type: "dropdown",
    icon: (editor, dropdown) => {
      return (
        dropdown.findItem(editor.context.config.get("editing.draw.itemType"))
          ?.icon || iconUse("pentool")
      );
    },
    items: [
      {
        icon: iconUse("pentool"),
        title: "Pen",
        key: "path",
        command: "addLayerView",
        args: ["path"],
        closable: true,
        nextTick: (editor) => {
          editor.context.config.set("editing.draw.itemType", "path");
        },
        shortcut: KeyStringMaker({ key: "P" }),
      },
      {
        icon: iconUse("brush"),
        title: "Pencil",
        key: "brush",
        command: "addLayerView",
        args: ["brush"],
        closable: true,
        nextTick: (editor) => {
          editor.context.config.set("editing.draw.itemType", "brush");
        },
        shortcut: KeyStringMaker({ key: "B" }),
      },
    ],
    events: [
      "config:editing.mode",
      "config:editing.mode.itemType",
      "config:editing.draw.itemType",
    ],
    selected: (editor) => {
      return (
        editor.context.config.is("editing.mode.itemType", "path") ||
        editor.context.config.is("editing.mode.itemType", "draw")
      );
    },
    selectedKey: (editor) => {
      return editor.context.config.get("editing.draw.itemType");
    },
  },
  {
    type: "dropdown",
    icon: (editor, dropdown) => {
      return (
        dropdown.findItem(editor.context.config.get("editing.svg.itemType"))
          ?.icon || iconUse("outline_rect")
      );
    },
    items: [
      {
        icon: iconUse("outline_rect"),
        title: "Rectangle",
        key: "svg-rect",
        command: "addLayerView",
        args: ["svg-rect"],
        closable: true,
        nextTick: (editor) => {
          editor.context.config.set("editing.svg.itemType", "svg-rect");
        },
        shortcut: KeyStringMaker({ key: "Shift+R" }),
      },
      {
        icon: iconUse("outline_circle"),
        title: "Circle",
        key: "svg-circle",
        command: "addLayerView",
        args: ["svg-circle"],
        closable: true,
        nextTick: (editor) => {
          editor.context.config.set("editing.svg.itemType", "svg-circle");
        },
        shortcut: KeyStringMaker({ key: "Shift+O" }),
      },
      {
        icon: iconUse("polygon"),
        title: "Polygon",
        key: "svg-polygon",
        command: "addLayerView",
        args: [
          "polygon",
          {
            backgroundColor: "transparent",
          },
        ],
        closable: true,
        nextTick: (editor) => {
          editor.context.config.set("editing.svg.itemType", "polygon");
        },
        shortcut: KeyStringMaker({ key: "Shift+P" }),
      },
      {
        icon: iconUse("star"),
        title: "Star",
        key: "star",
        command: "addLayerView",
        args: [
          "star",
          {
            backgroundColor: "transparent",
          },
        ],
        closable: true,
        nextTick: (editor) => {
          editor.context.config.set("editing.svg.itemType", "star");
        },
        shortcut: KeyStringMaker({ key: "Shift+S" }),
      },
      "-",
      {
        icon: iconUse("smooth"),
        title: "Spline",
        key: "spline",
        command: "addLayerView",
        args: [
          "spline",
          {
            backgroundColor: "transparent",
          },
        ],
        closable: true,
        nextTick: (editor) => {
          editor.context.config.set("editing.svg.itemType", "spline");
        },
        shortcut: KeyStringMaker({ key: "Shift+L" }),
      },
      {
        icon: iconUse("text_rotate"),
        title: "TextPath",
        key: "svg-texpath",
        command: "addLayerView",
        args: [
          "svg-textpath",
          {
            backgroundColor: "transparent",
          },
        ],
        closable: true,
        nextTick: (editor) => {
          editor.context.config.set("editing.svg.itemType", "svg-textpath");
        },
        shortcut: KeyStringMaker({ key: "Shift+T" }),
      },
    ],
    events: [
      "config:editing.mode",
      "config:editing.mode.itemType",
      "config:editing.svg.itemType",
    ],
    selected: (editor) => {
      return (
        editor.context.config.is("editing.mode", EditingMode.APPEND) &&
        (editor.context.config.is("editing.mode.itemType", "svg-rect") ||
          editor.context.config.is("editing.mode.itemType", "svg-circle") ||
          editor.context.config.is("editing.mode.itemType", "polygon") ||
          editor.context.config.is("editing.mode.itemType", "star") ||
          editor.context.config.is("editing.mode.itemType", "spline") ||
          editor.context.config.is("editing.mode.itemType", "svg-textpath"))
      );
    },
    selectedKey: (editor) => {
      return editor.context.config.get("editing.svg.itemType");
    },
  },
];
