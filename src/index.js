import "./scss/index.scss";

import Util from "./util/index";
import ColorPicker from "./colorpicker/index";
import CSSEditor from "./csseditor/index";


let yorkieClient = null; 
let yorkieDocument = null;

async function createYorkie() {
  try {
    // 01. create client with RPCAddr(envoy) then activate it.
    yorkieClient = yorkie.createClient('http://localhost:9000/api');
    await yorkieClient.activate();

    // 02. create a document then attach it into the client.
    yorkieDocument = yorkie.createDocument('easylogic.studio', 'webeditor');
    await yorkieClient.attach(yorkieDocument);

    yorkieDocument.update((root) => {
      if (!root.projects) {
        root['projects'] = []
      }
    }, 'init projects');
    yorkieDocument.subscribe((event) => {
      console.log(event);

        // 여긴 받은 change 를 업데이트를 해야하는데 
        console.log('a', yorkieDocument.toJSON());
    });
    await yorkieClient.sync();

  } catch (e) {
    console.error(e);
  }
}

function syncToYorkie (editor) {
  const projectsJSON = JSON.parse(editor.toJSON())

  if (yorkieDocument) {
    yorkieDocument.update((root) => {
      console.log(root);
      root.projects = projectsJSON;
    }, `update projects all items`);
  }

} 

async function startEditor() {

  // 시작 지점을 고쳐보자. 
  var app = new CSSEditor.createCSSEditor();
  app.commands.registerCommand({
    command: 'setAttribute',
    debounce: 100,
    execute: syncToYorkie
  })

  app.commands.registerCommand({
    command: 'newComponent',
    debounce: 100,
    execute: syncToYorkie
  })   


  // await createYorkie();


  return app;
}

export default {
  version: '@@VERSION@@',
  ...Util,
  ...ColorPicker,
  ...CSSEditor,
  startEditor
};


(async () => {
  window.editor = await startEditor();
})()

 