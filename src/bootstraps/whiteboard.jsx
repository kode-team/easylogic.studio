import { createWhiteBoard } from "apps";

function startEditor() {
  const idList = ["app"];

  return idList.map((id) => {
    return createWhiteBoard({
      container: document.getElementById(id),
      config: {
        "editor.theme": "light",
        // 'editor.layout.mode': 'svg',
        // 'show.left.panel': false,
        // 'show.right.panel': false,
        "show.ruler": false,
      },
      plugins: [],
    });
  });
}

window.EasylogicEditor = startEditor();
