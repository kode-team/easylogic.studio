import * as App from 'el/sapa/App'
import "../scss/index.scss";
import DesignEditor from "./designeditor";
import WhiteBoard from "./whiteboard";
import DataEditor from "./dataeditor";
export * from "export-library/index";

function createDesignEditor(opts) {
  return App.start(DesignEditor, opts);
}

function createDataEditor (opts) {
  return App.start(DataEditor, opts)
}

// createPageBuilder (opts = {}) {
//   return App.start(PageBuilder as any, opts)
// },  
function createWhiteBoard (opts) {
  return App.start(WhiteBoard, opts)
}    

export {
  createDesignEditor,
  createDataEditor,
  createWhiteBoard,
};
