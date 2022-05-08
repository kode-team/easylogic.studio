// import { Editor } from "elf/editor/manager/Editor";
import ColorMatrixEditor from "./editor/ColorMatrixEditor";
import FuncFilterEditor from "./editor/FuncFilterEditor";
import SVGFilterEditor from "./SVGFilterEditor";
import SVGFilterPopup from "./SVGFilterPopup";
import SVGFilterSelectEditor from "./SVGFilterSelectEditor";

import { iconUse } from "elf/editor/icon/icon";
import { StrokeLineCap, StrokeLineJoin } from "elf/editor/types/model";
import { ObjectProperty } from "elf/editor/ui/property/ObjectProperty";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerElement({
    ColorMatrixEditor,
    FuncFilterEditor,
    SVGFilterSelectEditor,
    SVGFilterEditor,
  });

  editor.registerUI("inspector.tab.style", {
    SVGItemProperty: ObjectProperty.create({
      title: editor.$i18n("svg.item.property.title"),
      editableProperty: "svg-item",
      preventUpdate: true, // 마우스를 드래그 하는 동안은 업데이트 하지 않음.
    }),
  });

  editor.registerUI("popup", {
    SVGFilterPopup,
  });

  editor.registerInspector("svg-item", (current) => {
    return [
      {
        key: "edit",
        editor: "Button",
        editorOptions: {
          text: "Edit",
          action: ["open.editor", current],
        },
      },
      {
        type: "column",
        size: [2, 1],
        columns: [
          { type: "label", label: editor.$i18n("svg.item.property.fill") },
          {
            key: "fill-rule",
            editor: "ToggleCheckBox",
            editorOptions: {
              toggleLabels: [iconUse("join_full"), iconUse("join_right")],
              toggleValues: ["nonzero", "evenodd"],
            },
            defaultValue: current["fill-rule"] || "nonzero",
          },
        ],
      },
      {
        type: "column",
        size: [2, 1],
        columns: [
          {
            key: "fill",
            editor: "FillSingleEditor",
            editorOptions: {
              wide: true,
            },
            defaultValue: current["fill"],
          },
          {
            key: "fill-opacity",
            editor: "number-input",
            editorOptions: {
              compact: true,
              label: "opacity",
              min: 0,
              max: 1,
              step: 0.01,
            },
            defaultValue: current["fill-opacity"],
          },
        ],
      },
      {
        type: "column",
        size: [2, 1],
        columns: [
          { type: "label", label: editor.$i18n("svg.item.property.stroke") },
        ],
      },
      {
        type: "column",
        size: [2, 1],
        columns: [
          {
            key: "stroke",
            editor: "fill-single",
            editorOptions: {
              wide: true,
            },
            defaultValue: current["stroke"],
          },
          {
            key: "stroke-width",
            editor: "number-input",
            editorOptions: {
              compact: true,
              label: "line_weight",
            },
            defaultValue: current["stroke-width"],
          },
        ],
      },
      {
        type: "column",
        size: [2, 1],
        columns: [
          {
            key: "stroke-dasharray",
            editor: "StrokeDashArrayEditor",
            editorOptions: {
              label: editor.$i18n("svg.item.property.dashArray"),
            },
            defaultValue: current["stroke-dasharray"] || "",
          },
          {
            key: "stroke-dashoffset",
            editor: "number-input",
            editorOptions: {
              compact: true,
              label: "power_input",
              min: -1000,
              max: 1000,
              step: 1,
            },
            defaultValue: current["stroke-dashoffset"],
          },
        ],
      },

      {
        key: "stroke-linecap",
        editor: "ToggleCheckBox",
        editorOptions: {
          label: editor.$i18n("svg.item.property.lineCap"),
          toggleLabels: [
            iconUse("line_cap_butt"),
            iconUse("line_cap_round"),
            iconUse("line_cap_square"),
          ],
          toggleValues: [
            StrokeLineCap.BUTT,
            StrokeLineJoin.ROUND,
            StrokeLineCap.SQUARE,
          ],
        },
        defaultValue: current["stroke-linecap"] || StrokeLineCap.BUTT,
      },
      {
        key: "stroke-linejoin",
        editor: "ToggleCheckBox",
        editorOptions: {
          label: editor.$i18n("svg.item.property.lineJoin"),
          toggleLabels: [
            iconUse("line_join_miter"),
            iconUse("line_join_round"),
            iconUse("line_join_bevel"),
          ],
          toggleValues: [
            StrokeLineJoin.MITER,
            StrokeLineJoin.ROUND,
            StrokeLineJoin.BEVEL,
          ],
        },
        defaultValue: current["stroke-linejoin"] || StrokeLineJoin.MITER,
      },
      {
        key: "mix-blend-mode",
        editor: "BlendSelectEditor",
        editorOptions: {
          label: editor.$i18n("svg.item.property.blend"),
        },
        defaultValue: current["mix-blend-mode"],
      },
    ];
  });

  editor.registerInspector("polygon", (item) => {
    return [
      {
        key: "count",
        editor: "NumberInputEditor",
        editorOptions: {
          label: "Count",
          min: 3,
          max: 100,
          step: 1,
        },
        defaultValue: item.count,
      },
      {
        key: "button",
        editor: "Button",
        editorOptions: {
          label: "Copy ",
          text: "as path",
          command: "copy.path",
        },
      },

      {
        key: "button2",
        editor: "Button",
        editorOptions: {
          label: "Test Popup",
          action: [
            "showComponentPopup",
            {
              title: "Sample Test Popup",
              width: 400,
              inspector: [
                {
                  key: "test",
                  editor: "Button",
                  editorOptions: {
                    label: "Test",
                    text: "text",
                    onClick: () => {
                      window.alert("yellow");
                    },
                  },
                },
              ],
            },
          ],
        },
      },
    ];
  });

  editor.registerInspector("spline", () => {
    return [
      {
        key: "boundary",
        editor: "SelectIconEditor",
        editorOptions: {
          label: "Boundary",
          options: ["clamped", "open", "closed"],
        },
      },
      {
        key: "button",
        editor: "Button",
        editorOptions: {
          label: "Copy ",
          text: "as path",
          action: "copy.path",
        },
      },
    ];
  });

  editor.registerInspector("star", (item) => {
    return [
      {
        key: "isCurve",
        editor: "ToggleCheckBox",
        editorOptions: {
          label: "Curve",
          defaultValue: item.isCurve,
        },
      },
      {
        key: "count",
        editor: "NumberInputEditor",
        editorOptions: {
          label: "Count",
          min: 3,
          max: 100,
          step: 1,
          wide: "true",
        },
      },
      {
        key: "radius",
        editor: "NumberInputEditor",
        editorOptions: {
          label: "Inner Radius",
          min: -1,
          max: 1,
          step: 0.01,
          wide: "true",
        },
      },
      {
        key: "tension",
        editor: "NumberInputEditor",
        editorOptions: {
          label: "Tension",
          min: 0,
          max: 1,
          step: 0.01,
          wide: "true",
        },
      },
      {
        key: "button",
        editor: "Button",
        editorOptions: {
          label: "Copy ",
          text: "as path",
          action: "copy.path",
        },
      },
    ];
  });
}
