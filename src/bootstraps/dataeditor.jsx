import { createDataEditor } from "apps";

function startEditor() {
  const idList = ["app"];

  return idList.map((id) => {
    return createDataEditor({
      container: document.getElementById(id),
      onChange: (editor, key, value) => {
        console.log(editor.getValue(), key, value);
      },
      inspector: [
        {
          editor: "Button",
          editorOptions: {
            text: "Edit",
            onClick: () => {
              console.log("a");
            },
          },
        },
        {
          type: "column",
          size: [1, 1],
          columns: [
            {
              key: "column1",
              editor: "color-view",
              editorOptions: {
                label: "Color",
              },
            },
          ],
        },
        {
          type: "folder",
          label: "folder test",
          children: [
            {
              key: "column1",
              editor: "color-view",
              editorOptions: {
                label: "Color",
              },
            },
            {
              type: "column",
              size: [1, 1],
              columns: [
                {
                  key: "column1",
                  editor: "color-view",
                  editorOptions: {
                    label: "Color",
                  },
                },
              ],
            },
          ],
        },
      ],
      config: {
        "editor.theme": "light",
        // 'editor.layout.mode': 'svg',
        // 'show.left.panel': false,
        // 'show.right.panel': false,
        // 'show.ruler': false,
      },
      plugins: [],
    });
  });
}

window.EasylogicEditor = startEditor();
