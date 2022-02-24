import EasyLogic from "./editor-layouts/index";

function startEditor() {

  const idList = ['app']

  return idList.map(id => {

    return EasyLogic.createWhiteBoard({
      container: document.getElementById(id),
      config: {
        'editor.theme': 'light',
        // 'editor.layout.mode': 'svg',
        // 'show.left.panel': false,
        // 'show.right.panel': false,
        // 'show.ruler': false,
      },
      plugins: [
        function (editor) {
          editor.on('changed', (method, id, attrs) => {

            // attrs = JSON.parse(JSON.stringify(attrs));

            // if (editor.isPointerUp) {
            //   console.log('up', 'changed', method, id, attrs)
            // } else {
            //   console.log('down', 'changed', method, id, attrs)
            // }
          })
        }
      ]
    });
  })
}

window.EasylogicEditor = startEditor(); 