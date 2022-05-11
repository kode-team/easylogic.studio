import { iconUse } from "elf/editor/icon/icon";
import {
  TextAlign,
  TextClip,
  TextDecoration,
  TextTransform,
} from "elf/editor/types/model";
import { ObjectProperty } from "elf/editor/ui/property/ObjectProperty";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerUI("inspector.tab.style", {
    TextProperty: ObjectProperty.create({
      title: editor.$i18n("text.property.title"),
      editableProperty: "text-style",
      preventUpdate: true,
    }),
  });

  editor.registerInspector("text-style", (current) => {
    return [
      {
        type: "column",
        size: [2, 1, 1],
        columns: [
          {
            key: "textAlign",
            editor: "SelectIconEditor",
            editorOptions: {
              compact: true,
              options: ["left", "center", "right", "justify"],
              icons: [
                "align_left",
                "align_center",
                "align_right",
                "align_justify",
              ],
            },
            defaultValue: current.textAlign || TextAlign.LEFT,
          },
          "-",
          {
            key: "textTransform",
            editor: "SelectIconEditor",
            editorOptions: {
              options: [
                { value: TextTransform.CAPITALIZE, text: "Ag" },
                { value: TextTransform.UPPERCASE, text: "AG" },
                { value: TextTransform.LOWERCASE, text: "ag" },
              ],
              compact: true,
              icons: ["horizontal_rule"],
            },
            defaultValue: current.textTransform,
          },
        ],
      },
      {
        type: "column",
        size: [3, 2, 1],
        gap: 20,
        columns: [
          {
            key: "textDecoration",
            editor: "SelectIconEditor",
            editorOptions: {
              options: [
                { value: TextDecoration.NONE, text: "None" },
                { value: TextDecoration.UNDERLINE, text: "Underline" },
                { value: TextDecoration.LINE_THROUGH, text: "LineThrough" },
              ],
              icons: ["horizontal_rule", "underline", "strikethrough"],
              onchange: "changeTextValue",
            },
            defaultValue: current.textDecoration,
          },
          {
            key: "fontStyle",
            editor: "SelectIconEditor",
            editorOptions: {
              compact: true,
              options: ["normal", "italic"],
              icons: ["title", "italic"],
            },
            defaultValue: current.fontStyle,
          },

          {
            key: "textClip",
            editor: "ToggleButton",
            editorOptions: {
              checkedValue: TextClip.TEXT,
              toggleLabels: [iconUse("vignette"), iconUse("vignette")],
              toggleTitles: ["", "Text Clip"],
              toggleValues: [TextClip.NONE, TextClip.TEXT],
            },
            defaultValue: current.textClip || TextClip.NONE,
          },
        ],
      },
    ];
  });
}
