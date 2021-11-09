import EasyLogic from "./editor-layouts/designeditor/index";

function startEditor() {

  const idList = ['app']

  return idList.map(id => {

    return EasyLogic.createDesignEditor({
      container: document.getElementById(id),
      config: {
        'editor.design.mode': 'item',
        'editor.layout.mode': 'svg',
        // 'show.left.panel': false,
        // 'show.right.panel': false,
        // 'show.ruler': false,
      }
    });
  })
}

window.EasylogicEditor = startEditor();