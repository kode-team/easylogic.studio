import EasyLogic from "./editor-layouts/designeditor/index";

function startEditor() {

  const idList = ['app']

  return idList.map(id => {

    return EasyLogic.createDesignEditor({
      container: document.getElementById(id),
      data: {
        version: "1.0.0",
        name: "Sample Project",
        description: "easylogic studio project ",
        projects: [{
          itemType: 'project', 
          layers: [
            {itemType: 'rect', x: '0px', y: '0px', width: '100px', height: '100px', 'background-color': 'red'},
            {itemType: 'rect', x: '20px', y: '20px', width: '100px', height: '100px', 'background-color': 'green'},
            {itemType: 'rect', x: '40px', y: '40px', width: '100px', height: '100px', 'background-color': 'blue'}
          ]
        }],
      },
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