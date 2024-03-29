import { createDesignEditor } from "apps";

function startEditor() {
  const idList = ["app"];

  return idList.map((id) => {
    return createDesignEditor({
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
          editor.on("changed", () => {
            // attrs = JSON.parse(JSON.stringify(attrs));
            // if (editor.isPointerUp) {
            //   console.log('up', 'changed', method, id, attrs)
            // } else {
            //   console.log('down', 'changed', method, id, attrs)
            // }
          });
        },
      ],
    });
  });
}

window.elfEditor = startEditor();
