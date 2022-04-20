import { createBlankEditor } from "./editor-layouts/index";
import { ObjectProperty } from "el/editor/ui/property/ObjectProperty";
import { iconUse } from "el/editor/icon/icon";

function startEditor() {
  const idList = ["app"];

  return idList.map((id) => {
    return createBlankEditor({
      container: document.getElementById(id),
      config: {
        "editor.theme": "light",
        // 'editor.layout.mode': 'svg',
        // 'show.left.panel': false,
        // 'show.right.panel': false,
        // 'show.ruler': false,
      },
      plugins: [
        function (editor) {
          editor.registerUI("layertab.tab", {
            Sample: {
              title: "Sample",
              icon: iconUse("add"),
              value: "sample",
            },
          });

          editor.config.set("layertab.selectedValue", "sample");

          editor.registerUI("inspector.tab", {
            Sample: {
              title: "Sample",
              value: "sample",
            },
          });

          editor.config.set("inspector.selectedValue", "sample");

          editor.registerUI("layertab.tab.sample", {
            SampleProperty: ObjectProperty.create({
              title: "Sample",
              visible: true,
              inspector: () => {
                return ["SampleProperty"];
              },
            }),
          });

          editor.registerUI("inspector.tab.sample", {
            SampleProperty: ObjectProperty.create({
              visible: true,
              title: "Sample",
              inspector: () => {
                return ["SampleProperty"];
              }
            })
          });
        }
      ]
    });
  });
}

window.elfEditor = startEditor();
