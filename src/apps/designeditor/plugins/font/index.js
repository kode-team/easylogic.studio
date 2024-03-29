// import { Editor } from "elf/editor/manager/Editor";
import { ObjectProperty } from "elf/editor/ui/property/ObjectProperty";
import { Length } from "elf/editor/unit/Length";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerUI("inspector.tab.style", {
    FontProperty: ObjectProperty.create({
      title: editor.$i18n("font.property.title"),
      editableProperty: "font",
      preventUpdate: true,
    }),
  });

  editor.registerInspector("font", (current) => {
    return [
      {
        key: "font-family",
        editor: "SelectEditor",
        editorOptions: {
          compact: true,
          label: "font_download",
          options: [
            "",
            "Arial",
            "Arial Black",
            "Times New Roman",
            "Times",
            "Courier New",
            "Courier",
            "Verdana",
            "Georgia",
            "Palatino",
            "Garamond",
            "Bookman",
            "Tahoma",
            "Trebuchet MS",
            "Impact",
            "Comic Sans MS",
            "serif",
            "sans-serif",
            "monospace",
            "cursive",
            "fantasy",
            "system-ui",
          ],
        },
        defaultValue: current.fontFamily || "",
      },
      {
        type: "column",
        size: [1, 1],
        gap: 10,
        columns: [
          {
            key: "font-size",
            editor: "NumberInputEditor",
            editorOptions: {
              label: "format_size",
              compact: true,
              min: 8,
              max: 1000,
              step: 1,
            },
            defaultValue: Length.parse(current.fontSize).value,
            convert: (key, value) => Length.px(value),
          },
          {
            key: "padding",
            editor: "NumberInputEditor",
            editorOptions: {
              label: "padding",
              compact: true,
              min: 8,
              max: 1000,
              step: 1,
            },
            defaultValue: Length.parse(current.paddingTop).value,
            convert: (key, value) => Length.px(value),
          },
        ],
      },

      {
        type: "column",
        size: [1, 1],
        columns: [
          {
            key: "color",
            editor: "ColorViewEditor",
            editorOptions: {
              compact: true,
            },
            defaultValue: current.color || "#000",
          },
          {
            key: "font-weight",
            editor: "NumberInputEditor",
            editorOptions: {
              label: "format_bold",
              compact: true,
              min: 100,
              max: 900,
              step: 100,
            },
            defaultValue: current.fontWeight || 400,
          },
        ],
      },

      {
        type: "column",
        size: [1, 1, 1],
        gap: 10,
        columns: [
          {
            key: "text-indent",
            editor: "NumberInputEditor",
            editorOptions: {
              label: "format_indent",
              min: -100,
              max: 100,
              step: 1,
              compact: true,
            },
            defaultValue: Length.parse(current.textIndent).value,
            convert: (key, value) => Length.px(value),
          },

          {
            key: "line-height",
            editor: "NumberInputEditor",
            editorOptions: {
              label: "format_line_spacing",
              min: 0,
              max: 10,
              step: 0.01,
              compact: true,
            },
            defaultValue: current.lineHeight || 1.2,
          },
          {
            key: "letter-spacing",
            editor: "NumberInputEditor",
            editorOptions: {
              label: "space",
              min: -100,
              max: 100,
              step: 1,
              compact: true,
            },
            defaultValue: Length.parse(current.letterSpacing).value,
            convert: (key, value) => Length.px(value),
          },
        ],
      },
    ];
  });
}
