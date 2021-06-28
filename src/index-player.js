import EasyLogic from "./editor-layouts/designplayer/index";

function startPlayer(opt = {}) {
  var app = new EasyLogic.createDesignPlayer({
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
    plugins: [
      function (editor) {
        console.log(editor);
      }
    ]
  });

  return app;
}

startPlayer();
