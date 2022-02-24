import * as App from 'el/sapa/App'
import "../scss/index.scss";
import DesignEditor from "./designeditor";
import WhiteBoard from "./whiteboard";
import DataEditor from "./dataeditor";
import exportLibrary from "export-library/";

export default {
  createDesignEditor(opts = { type: "white" }) {
    return App.start(DesignEditor, opts);
  },
  createDataEditor (opts = {}) {
    return App.start(DataEditor, opts)
  },
  createPageBuilder (opts = {}) {
    return App.start(PageBuilder, opts)
  },  
  createWhiteBoard (opts = {}) {
    return App.start(WhiteBoard, opts)
  },    
  ...exportLibrary
};
