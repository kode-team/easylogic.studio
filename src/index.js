import "./scss/index.scss";

import Util from "./util/index";
import ColorPicker from "./colorpicker/index";
import CSSEditor from "./csseditor/index";


let yorkieClient = null; 
let yorkieDocument = null;

async function createYorkie(app) {
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

      if (event.name === 'remote-change') {
        const [change] = event.value;
        const command = JSON.parse(change.message);

        switch(command.command) {
        case 'newComponent': 
          app.emit('loadJSON', JSON.parse(yorkieDocument.toJSON()).projects);
          break; 
        case 'setAttribute': 
          traverseItem(command.ids, (id, item) => {
            var newAttrs = {}
            Object.keys(command.attrs).forEach(key => {
              newAttrs[key] = item[key];
            })

            app.emit('setAttributeSync', newAttrs, id);
          })

          break;
        case 'moveItemByDrag': 
          traverseItem(command.ids, (id, item) => {
            app.emit('setAttributeSync', JSON.parse(item.toJSON()), id);
          })
          break; 
        }

        // 여긴 받은 change 를 업데이트를 해야하는데 


      } else {
        // console.log(yorkieDocument.toJSON())
      }
    });
    await yorkieClient.sync();

  } catch (e) {
    console.error(e);
  }
}

function traverseItem (ids, callback) {
  const projects = yorkieDocument.getRootObject().projects;

  ids.forEach(id => {
    var item = searchItem(projects, id);

    if (item) {
      callback && callback(id, item);
    }

  })

}

function searchItem(list, id, attrs) {

  for(var i = 0, len = list.length; i < len; i++) {
    const item = list.getElementByIndex(i)
    if (item.id === id) {
      return item; 
    } else {
      var searchedItem = searchItem(item.layers, id);

      if (searchedItem) {
        return searchedItem;
      }
    }
  }

  return null;
}

async function startEditor() {

  // 시작 지점을 고쳐보자. 
  var app = new CSSEditor.createCSSEditor();
  app.commands.registerCommand({
    command: 'setAttribute',
    debounce: 100,
    execute: (editor, attrs, ids) => {

      const items = editor.selection.itemsByIds(ids);


      yorkieDocument.update((root) => {
        const projects = root.projects;

        if (!projects.length) {
          const projectsJSON = JSON.parse(editor.toJSON())
          root.projects = projectsJSON
        } else {
          items.forEach(item => {

            Object.keys(attrs).forEach(key => {
                const syncItem = searchItem(root.projects, item.id);
                // 데이타 업데이트 
                if (syncItem) {
                  syncItem[key] = attrs[key];
                }
            })
          });
        }



      }, JSON.stringify({command: 'setAttribute', attrs, ids: items.map(it => it.id)}));
    }
  })

  app.commands.registerCommand({
    command: 'newComponent',
    debounce: 100,
    execute: (editor, type) => {
      const projectsJSON = JSON.parse(editor.toJSON())

      if (yorkieDocument) {
        yorkieDocument.update((root) => {
          root.projects = projectsJSON;
        }, JSON.stringify({command: 'newComponent', type}));
      }
    }
  })  
  
  app.commands.registerCommand({
    command: "moveItemByDrag",
    execute: (editor) => {
      const items = editor.selection.itemsByIds(null);

      yorkieDocument.update((root) => {
        items.forEach(item => {
          const syncItem = searchItem(root.projects, item.id);
          const json = item.toJSON();
          Object.keys(json).forEach(key => {
            syncItem[key] = json[key];
          })

        });

      }, JSON.stringify({command: 'moveItemByDrag', ids: items.map(it => it.id)}));

    }
  })


  await createYorkie(app);


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

 