import { BIND, SUBSCRIBE } from "sapa";

import { createBlankEditor } from "apps";

import { iconUse } from "elf/editor/icon/icon";
// eslint-disable-next-line no-unused-vars
import { Editor } from "elf/editor/manager/Editor";
import { UPDATE_VIEWPORT } from "elf/editor/types/event";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { ObjectProperty } from "elf/editor/ui/property/ObjectProperty";
import { TreeProvider, TreeView } from "elf/editor/ui/view/TreeView";

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
        /**
         *
         * @param {Editor} editor
         */
        function (editor) {
          editor.registerUI("layertab.tab", {
            Sample: {
              title: "Sample",
              icon: iconUse("add"),
              value: "sample",
            },
          });

          editor.context.config.set("layertab.selectedValue", "sample");

          editor.registerUI("layertab.tab.sample", {
            TreeView: [
              TreeView,
              {
                provider: new (class extends TreeProvider {
                  async getRoot() {
                    return [
                      {
                        title: "Root",
                        value: "root",
                        children: [{ title: "Child", value: "child" }],
                      },
                    ];
                  }
                })(),
              },
            ],
          });

          editor.registerUI("inspector.tab", {
            Sample: {
              title: "Sample",
              value: "sample",
            },
          });

          editor.context.config.set("inspector.selectedValue", "sample");

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
              },
            }),
          });

          editor.registerUI("canvas.view", {
            Sample: class extends EditorElement {
              template() {
                return "<div class='text-3xl font-bold underline'>fdsajfkdlsajfkdlsadfjksl</div>";
              }

              [BIND("$el")]() {
                const {
                  translate,
                  transformOrigin: origin,
                  scale,
                } = this.$viewport;

                const transform = `translate(${translate[0]}px, ${
                  translate[1]
                }px) scale(${scale || 1})`;
                const transformOrigin = `${origin[0]}px ${origin[1]}px`;

                return {
                  style: {
                    "transform-origin": transformOrigin,
                    transform,
                  },
                };
              }

              [SUBSCRIBE(UPDATE_VIEWPORT)]() {
                this.bindData("$el");
              }
            },
          });

          editor.registerMenu("toolbar.center", [
            {
              type: "button",
              title: "Sample",
            },
          ]);

          editor.registerMenu("toolbar.right", [
            {
              type: "button",
              title: "Sample",
            },
          ]);

          // root menu
          editor.registerMenu("toolbar.left", [
            {
              type: "dropdown",
              icon: `<div class="logo-item"><label class='logo'></label></div>`,
              items: [
                {
                  title: "menu.item.fullscreen.title",
                  command: "toggle.fullscreen",
                  shortcut: "ALT+/",
                },
              ],
            },
            {
              type: "button",
              title: "test button",
              action: (editor, $menuItem) => {
                console.log("test button", $menuItem);
              },
              style: {
                // 'background-color': 'purple'
              },
            },
            {
              type: "dropdown",
              title: "file",
              items: [
                {
                  title: "menu.item.fullscreen.title",
                  command: "toggle.fullscreen",
                  shortcut: "ALT+/",
                },
                "-",
                "a",
                {
                  type: "divider",
                },
                {
                  title: "menu.item.fullscreen.title",
                  action: () => {
                    window.alert("tool");
                  },
                  shortcut: "ALT+/",
                },
              ],
            },
          ]);
        },
      ],
    });
  });
}

window.elfEditor = startEditor();
