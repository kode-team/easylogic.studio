import EasyLogic from "./editor-layouts/designeditor/index";

function startEditor() {
  var app = new EasyLogic.createDesignEditor({
    container: document.getElementById('app'),
    data: {
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
      // "style.page-view-color": "black"
    //   "show.ruler": false,
    //   "show.left.panel": false,
    //   "show.right.panel": false
    },
    plugins: [
      function (editor) {
        editor.on('changeValue', function (id, attrs) {
          // console.log(id, attrs);
        })
      }
    ]
  });

  return app;
}

window.EasylogicEditor = startEditor();
